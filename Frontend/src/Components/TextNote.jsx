import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/TextNote.css";

const TextNote = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [error, setError] = useState("");

    // Fetch all notes
    const fetchNotes = async () => {
    try {
        const res = await axios.get("http://127.0.0.1:8000/api/notes/");

        const notesData = Array.isArray(res.data)
            ? res.data
            : res.data.results || [];

        setNotes(notesData.filter(note => note.type === "Tx"));
        setError("");
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
            await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`);
            setSelectedNote(null);
            fetchNotes();
        } catch (err) {
            console.error(err);
            alert("Failed to delete note.");
        }
    };

    // Safe truncate function
    const truncate = (content, length = 180) => {
        if (content === null || content === undefined) return "";

        const text =
            typeof content === "string"
                ? content
                : JSON.stringify(content);

        return text.length > length
            ? text.substring(0, length) + "..."
            : text;
    };

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

            <p className="note-preview">
                {truncate(note.content)}
            </p>

            <div className="card-footer">
                <span>
                    {note.type === "Tx" ? "Text" : "List"}
                </span>

                <div
                    className="note-card-actions"
                    onClick={(e) => e.stopPropagation()}
                    /* Added layout flex and gap to space out the icons */
                    style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                    <Link to={`/update/${note.id}`} style={{ textDecoration: "none" }}>
                        ✏️
                    </Link>

                    <button
                        onClick={() => deleteNote(note.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
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
                            {typeof selectedNote.content === "string"
                                ? selectedNote.content
                                : JSON.stringify(selectedNote.content, null, 2)}
                        </div>

                        <span className="modal-type">
                            {selectedNote.type === "Tx" ? "Text" : "List"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextNote;