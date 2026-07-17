import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/CreateNotes.css";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/UpdateNotes.css";

const UpdateNotes = () => {
    const { id } = useParams();
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("Tx");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${id}/`);

                setTitle(res.data.title);
                setContent(res.data.content);
                setType(res.data.type);


            } catch (err) {
                setError("Unable to load note.");
            }
        };

        fetchNote();
    }, [id]);

    const updateNote = async (e) => {
        e.preventDefault();

        if (title.trim() === "" || content.trim() === "") {
            setError("Title and content cannot be empty");
            return;
        }

        try {
            setError(null);

            const res = await api.put(
                `/notes/${id}/`,
                {
                    title,
                    content,
                    type,
                }
            );

            // alert("Note updated successfully!");
            console.log(res.data);
            navigate('/')
        } catch (err) {
            console.error(err);
            setError("Failed to update the note.");
        }
    };

    return (
        <div className="notes-page">
            <div className="notes-container">
                <div className="notes-card">

                    <h1 className="notes-title">Update Note</h1>
                    <p className="notes-subtitle">
                        Edit your existing note.
                    </p>

                    {error && <div className="error">{error}</div>}

                    <form onSubmit={updateNote}>

                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="Untitled"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                placeholder="Start writing..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="note-actions">
                            <button type="submit" className="save-btn">
                                Save Note
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default UpdateNotes;