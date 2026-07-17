import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../Styles/TextNote.css";

const ListNote = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [error, setError] = useState("");

    const fetchNotes = async () => {
        try {
            const res = await axios.get("/notes/");

            const notesData = Array.isArray(res.data)
                ? res.data
                : res.data.results || [];

            setNotes(notesData.filter((note) => note.type === "Li"));
            setError("");

            // Keep modal sync with updated data if it's currently open
            if (selectedNote) {
                const updatedSelected = notesData.find(n => n.id === selectedNote.id);
                if (updatedSelected) setSelectedNote(updatedSelected);
            }
        } catch (err) {
            console.error(err);
            setNotes([]);
            setError("Unable to load notes.");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedNote(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = selectedNote ? "hidden" : "auto";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [selectedNote]);

    const deleteNote = async (id) => {
        if (!window.confirm("Delete this note?")) return;

        try {
            await axios.delete(`/notes/${id}/`);
            setSelectedNote(null);
            fetchNotes();
        } catch (err) {
            console.error(err);
            alert("Failed to delete note.");
        }
    };

    // New function to update single item completion status in the backend JSON database
    const handleToggleItem = async (note, itemId) => {
        // Map items to toggle the specific target item
        const updatedItems = note.content.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        const updatedContent = {
            ...note.content,
            items: updatedItems
        };

        try {
            // Update via Django API PATCH
            const res = await api.patch(
                `/notes/${note.id}/`,
                {
                    content: updatedContent
                }
            );

            // Update UI state locally immediately
            setNotes(prevNotes => prevNotes.map(n => n.id === note.id ? { ...n, content: updatedContent } : n));
            if (selectedNote && selectedNote.id === note.id) {
                setSelectedNote({ ...selectedNote, content: updatedContent });
            }
        } catch (err) {
            console.error("Failed to update item state", err);
            alert("Could not update item.");
        }
    };

    // Helper arrays for split modal content lists
    const activeItems = selectedNote?.content?.items?.filter(item => !item.completed) || [];
    const completedItems = selectedNote?.content?.items?.filter(item => item.completed) || [];

    return (
        <div className="keep-page">

            {error && <p>{error}</p>}

            <div className="keep-grid">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="keep-card"
                        onClick={() => setSelectedNote(note)}
                    >
                        <h2>{note.title}</h2>

                        <div className="note-preview">
                            {/* Dashboard view also sorts incomplete items first */}
                            {[...(note.content?.items || [])]
                                .sort((a, b) => a.completed - b.completed)
                                .slice(0, 4)
                                .map((item) => (
                                    <div key={item.id} className="list-item" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => handleToggleItem(note, item.id)}
                                        />
                                        <span className={item.completed ? "completed" : ""}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}

                            {note.content?.items?.length > 4 && (
                                <p>+{note.content.items.length - 4} more...</p>
                            )}
                        </div>

                        <div className="card-footer">
                            <span>List</span>

                            <div
                                className="note-card-actions"
                                onClick={(e) => e.stopPropagation()}
                                /* Added flex layout alignment with 15px gap spacing */
                                style={{ display: "flex", alignItems: "center", gap: "15px" }}
                            >
                                <Link to={`/updatelist/${note.id}`} style={{ textDecoration: "none" }}>
                                    ✏️
                                </Link>

                                <button onClick={() => deleteNote(note.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                    🗑️
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {selectedNote && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedNote(null)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-btn"
                            onClick={() => setSelectedNote(null)}
                        >
                            ×
                        </button>

                        <h2>{selectedNote.title}</h2>

                        <div className="modal-content">
                            {/* SECTION 1: Active Items */}
                            {activeItems.length > 0 && (
                                <div className="active-section">
                                    {activeItems.map((item) => (
                                        <div key={item.id} className="list-item">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => handleToggleItem(selectedNote, item.id)}
                                            />
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Divider line shown only if both sections have items */}
                            {activeItems.length > 0 && completedItems.length > 0 && <hr className="section-divider" />}

                            {/* SECTION 2: Completed Items */}
                            {completedItems.length > 0 && (
                                <div className="completed-section">
                                    <h4 className="completed-heading">Completed ({completedItems.length})</h4>
                                    {completedItems.map((item) => (
                                        <div key={item.id} className="list-item checked-item">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => handleToggleItem(selectedNote, item.id)}
                                            />
                                            <span className="completed">{item.text}</span>
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>

                        <span className="modal-type">List</span>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ListNote;
