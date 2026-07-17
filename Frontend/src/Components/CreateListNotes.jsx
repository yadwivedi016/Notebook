import React, { useState, useRef, useEffect } from "react";
import "../Styles/CreateListNotes.css";
import api from "../api";

let idCounter = 0;
const createItem = () => ({ id: ++idCounter, text: "", completed: false });

const CreateListNotes = () => {
    const [title, setTitle] = useState("");
    const [items, setItems] = useState(() => [createItem()]);
    const [focusId, setFocusId] = useState(null);

    const itemRefs = useRef({});

    // Whenever focusId is set, move focus to that item's input once
    // React has finished rendering the updated list.
    useEffect(() => {
        if (focusId !== null && itemRefs.current[focusId]) {
            itemRefs.current[focusId].focus();
            setFocusId(null);
        }
    }, [items, focusId]);

    const handleItemChange = (index, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], text: value };
        setItems(updated);
    };

    const handleCheckbox = (index) => {
        const updated = [...items];
        updated[index] = { ...updated[index], completed: !updated[index].completed };
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, createItem()]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Enter keeps ("saves") whatever text is already in the current item
    // and inserts a fresh item right after it, then focuses the new one.
    const handleItemKeyDown = (e, index) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const newItem = createItem();
        const updated = [...items];
        updated.splice(index + 1, 0, newItem);

        setItems(updated);
        setFocusId(newItem.id);
    };

    // Pressing Enter in the title would otherwise submit the form early
    // (default browser behavior). Send focus to the first item instead.
    const handleTitleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (items[0]) setFocusId(items[0].id);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
        alert("Title is required.");
        return;
    }

    const filteredItems = items.filter(
        (item) => item.text.trim() !== ""
    );

    if (filteredItems.length === 0) {
        alert("Please add at least one item.");
        return;
    }

    try {
        const response = await api.post("/notes/",
            {
                title: title,
                content: {
                    items: filteredItems,
                },
                type: "Li",
            }
        );

        console.log(response.data);
        alert("List note saved successfully.");

        setTitle("");
        setItems([createItem()]);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.log(error.response.data);
            alert(JSON.stringify(error.response.data));
        } else {
            alert("Failed to save list note.");
        }
    }
};

    return (
        <div className="notes-page">
            <div className="notes-container">
                <div className="notes-card">
                    <form onSubmit={handleSubmit}>
                        <h2 className="notes-title">Create List Note</h2>
                        <p className="notes-subtitle">Jot down a quick checklist.</p>

                        <div className="form-group">
                            <label htmlFor="list-note-title">Title</label>
                            <input
                                id="list-note-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={handleTitleKeyDown}
                                placeholder="Enter title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Items</label>

                            <div className="list-items">
                                {items.map((item, index) => (
                                    <div className="list-item-row" key={item.id}>
                                        <input
                                            type="checkbox"
                                            className="list-item-checkbox"
                                            checked={item.completed}
                                            onChange={() => handleCheckbox(index)}
                                            aria-label="Mark item complete"
                                        />

                                        <input
                                            type="text"
                                            ref={(el) => (itemRefs.current[item.id] = el)}
                                            className={
                                                item.completed
                                                    ? "list-item-input completed"
                                                    : "list-item-input"
                                            }
                                            value={item.text}
                                            placeholder="List item"
                                            onChange={(e) =>
                                                handleItemChange(index, e.target.value)
                                            }
                                            onKeyDown={(e) => handleItemKeyDown(e, index)}
                                        />

                                        <button
                                            type="button"
                                            className="list-item-delete"
                                            onClick={() => removeItem(index)}
                                            aria-label="Delete item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button type="button" className="add-item-btn" onClick={addItem}>
                                + Add Item
                            </button>
                        </div>

                        <div className="note-actions">
                            <button type="submit" className="save-btn">
                                Save List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListNotes;