import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import '../Styles/CreateNotes.css'

const CreateTextNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('Tx');
    const [error, setError] = useState(null);

    // Use a standard async function instead of useEffect inside an event handler
    const addNote = async (e) => {
        e.preventDefault();

        // Fixed: Added () to call the trim functions properly
        if (title.trim() === '' || content.trim() === '') {
            setError('Title and content cannot be empty');
            return;
        }

        try {
            setError(null); // Clear any previous errors
            const response = await api.post("/notes/", {
                title,
                content,
                type
            });

            alert(JSON.stringify(response.data)); // Safely alert the response object
            setTitle(''); // Clear inputs on success
            setContent('');
        } catch (err) {
            setError('Failed to save the note.');
            console.error(err);
        }
    };

    return (
        <div className="notes-page">
            <div className="notes-container">
                <div className="notes-card">

                    <h1 className="notes-title">Create Note</h1>
                    <p className="notes-subtitle">
                        Write and organize your thoughts.
                    </p>

                    {error && <div className="error">{error}</div>}

                    <form onSubmit={addNote}>
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

export default CreateTextNotes;
