import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import "../Styles/Navbar.css";

/**
 * App navigation bar.
 *
 * Props:
 *  - onNewNote: (type: string) => void
 *  - onSearch: (value: string) => void
 */
export default function Navbar({
    onNewNote,
    onSearch,
}) {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get current active path dynamically
    const dropdownRef = useRef(null);

    // Dynamic state evaluation on every location change
    const currentPath = location.pathname;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    const handleDropdownClick = (path) => {
        setShowDropdown(false);
        navigate(path);
    };

    const links = [
        { label: "Text", path: "/" },
        { label: "List", path: "/listnote" },
        { label: "Labels", path: "/" },

    ];

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-mark">N</span>
                    <span className="navbar-brand-text">Notebook</span>
                </Link>

                <nav className="navbar-links">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            // Compares against current location dynamically
                            className={`navbar-link ${currentPath === link.path ? "navbar-link-active" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="navbar-actions">
                    <div className="navbar-search">
                        <svg
                            className="navbar-search-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={query}
                            onChange={handleSearchChange}
                            aria-label="Search notes"
                        />
                    </div>

                    <div className="navbar-dropdown" ref={dropdownRef}>
                        <button
                            className={`navbar-new-btn ${showDropdown ? "active" : ""}`}
                            onClick={() => setShowDropdown((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={showDropdown}
                        >
                            <span>Create Note</span>
                            <svg 
                                className="chevron-icon" 
                                width="12" 
                                height="12" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="navbar-dropdown-menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleDropdownClick("/textnote")}
                                >
                                    Text Note
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleDropdownClick("/createlist")}
                                >
                                    List Note
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}