import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/CreateListNotes.css";
import { Link } from "react-router-dom";

const UpdateListNotes = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [items, setItems] = useState([]);
    const [focusId, setFocusId] = useState(null);

    const itemRefs = useRef({});
    const idCounter = useRef(1000);

    useEffect(() => {
        fetchNote();
    }, []);

    useEffect(() => {
        if (focusId && itemRefs.current[focusId]) {
            itemRefs.current[focusId].focus();
            setFocusId(null);
        }
    }, [items, focusId]);

    const fetchNote = async () => {
        try {
            const res = await api.get(`/notes/${id}/`);

            setTitle(res.data.title);

            const fetchedItems =
                res.data.content?.items?.map((item) => ({
                    ...item,
                    id: item.id ?? ++idCounter.current,
                })) || [];

            setItems(
                fetchedItems.length
                    ? fetchedItems
                    : [{ id: ++idCounter.current, text: "", completed: false }]
            );
        } catch (err) {
            console.error(err);
            alert("Unable to load note.");
        }
    };

    const handleItemChange = (index, value) => {
        const updated = [...items];
        updated[index].text = value;
        setItems(updated);
    };

    const handleCheckbox = (index) => {
        const updated = [...items];
        updated[index].completed = !updated[index].completed;
        setItems(updated);
    };

    const addItem = () => {
        const newItem = {
            id: ++idCounter.current,
            text: "",
            completed: false,
        };

        setItems([...items, newItem]);
        setFocusId(newItem.id);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemKeyDown = (e, index) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const newItem = {
            id: ++idCounter.current,
            text: "",
            completed: false,
        };

        const updated = [...items];
        updated.splice(index + 1, 0, newItem);

        setItems(updated);
        setFocusId(newItem.id);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        if (items.length) {
            setFocusId(items[0].id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const filteredItems = items.filter(
            (item) => item.text.trim() !== ""
        );

        if (!title.trim()) {
            alert("Title is required.");
            return;
        }

        if (!filteredItems.length) {
            alert("Please add at least one item.");
            return;
        }

        try {
            await api.put(`/notes/${id}/`,
                {
                    title,
                    content: {
                        items: filteredItems,
                    },
                    type: "Li",
                }
            );

            alert("List note updated successfully.");
            navigate("/listnotes"); // Change to your route
        } catch (err) {
            console.error(err);

            if (err.response) {
                alert(JSON.stringify(err.response.data));
            } else {
                alert("Update failed.");
            }
        }
    };

    return (
        <div className="notes-page">
            <div className="notes-container">
                <div className="notes-card">
                    <form onSubmit={handleSubmit}>
                        <h2 className="notes-title">
                            Update List Note
                        </h2>

                        <p className="notes-subtitle">
                            Edit your checklist.
                        </p>

                        <div className="form-group">
                            <label>Title</label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                onKeyDown={handleTitleKeyDown}
                            />
                        </div>

                        <div className="form-group">
                            <label>Items</label>

                            <div className="list-items">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="list-item-row"
                                    >
                                        <input
                                            type="checkbox"
                                            className="list-item-checkbox"
                                            checked={item.completed}
                                            onChange={() =>
                                                handleCheckbox(index)
                                            }
                                        />

                                        <input
                                            type="text"
                                            ref={(el) =>
                                                (itemRefs.current[item.id] = el)
                                            }
                                            className={
                                                item.completed
                                                    ? "list-item-input completed"
                                                    : "list-item-input"
                                            }
                                            value={item.text}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleItemKeyDown(e, index)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="list-item-delete"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="add-item-btn"
                                onClick={addItem}
                            >
                                + Add Item
                            </button>
                        </div>

                        <div className="note-actions">
                            <button
                                type="submit"
                                className="save-btn"
                            >
                                Update List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateListNotes;