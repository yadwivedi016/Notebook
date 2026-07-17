import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useParams } from "react-router-dom";
import "../Styles/DetailsNotes.css";

const DetailailsNotes = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState("");

    const { id } = useParams();

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

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="details-page">
            <div className="details-card">

                <div className="details-header">
                    <h1>{title}</h1>

                    <span>
                        {type === "Tx" ? "Text" : "List"}
                    </span>
                </div>

                <div className="details-body">

                    <hr />

                    <div className="details-content">
                        {content}
                    </div>

                </div>

                <div className="details-actions">

                    <Link to={`/update/${id}`}>
                        <button className="edit-btn">
                            Edit
                        </button>
                    </Link>

                    <Link to="/">
                        <button className="back-btn">
                            Back
                        </button>
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default DetailailsNotes;