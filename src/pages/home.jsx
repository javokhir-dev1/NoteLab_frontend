import { act, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Modal from "../components/modal/modal.jsx";
import ErrModal from "../components/errorModal/errorModal.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

import "./css/home.css"
import "./css/responsive.css"

function Home() {
    const token = JSON.parse(localStorage.getItem("token"))
    const [user, setUser] = useState({ email: "", username: "" })
    const [folders, setFolders] = useState([])
    const [refreshFolders, setRefreshFolders] = useState(0);
    const [errModalTitle, setErrModalTitle] = useState("")

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

    const showError = (message) => {
        setErrModalTitle(message);
        setIsErrorModalOpen(true);
    };

    const username = user.username
        ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()
        : "";

    const navigate = useNavigate()

    useEffect(() => {
        if (!token || !token.token || !token.success) {
            localStorage.removeItem("token");
            navigate("/login")
        } else {
            async function fetchData() {
                try {
                    const res = await fetch(`${apiUrl}/users/profile`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token.token}`
                        }
                    })

                    if (!res.ok) {
                        localStorage.removeItem("token");
                        navigate("/login")
                        throw new Error("Profil ma'lumotlarini olishda xatolik yuz berdi");
                    }

                    const json = await res.json()
                    if (!json.success) {
                        localStorage.removeItem("token");
                        navigate("/login")
                    } else {
                        setUser(json.user)
                    }
                } catch (err) {
                    localStorage.removeItem("token");
                    navigate("/login")
                    console.log(err)
                }
            }

            fetchData()

            async function foldersData() {
                try {
                    const res = await fetch(`${apiUrl}/folders/show-folder`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token.token}`
                        }
                    })

                    const json = await res.json()
                    setFolders(json.data)
                } catch (err) {
                    showError(err.message)
                }
            }

            foldersData()
        }
    }, [navigate, refreshFolders])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")
    const [newFolderNameErr, setNewFolderNameErr] = useState("")

    const handleClick = async () => {
        if (newFolderName === "") {
            setNewFolderNameErr("Enter folder name")
        } else {
            setNewFolderNameErr("")
            try {
                let data = await fetch(`${apiUrl}/folders/create-folder`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token.token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ noteName: newFolderName })
                })

                let json = await data.json()
                if (json.success) {
                    setRefreshFolders(prev => prev + 1)
                    setIsModalOpen(false)
                    setNewFolderName("")
                } else {
                    showError("Folder qo'shishda xatolik!")
                }
            } catch (err) {
                showError(err.message)
            }
        }
    }

    const [isFolderOpen, setIsFolderOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [notes, setNotes] = useState([])

    const [activeFolder, setActiveFolder] = useState(null)

    const openFolder = async (id) => {
        localStorage.setItem("folderId", id)
        setIsFolderOpen(true)
        try {
            let data = await fetch(`${apiUrl}/folders/show-folder/${id}`)
            let json = await data.json()
            setFolderName(json.folder.noteName)
            setNotes(json.notes)
        } catch (err) {
            showError(err.message)
        }
    }

    const [newNote, setNewNote] = useState("")

    const createNote = async () => {
        const id = localStorage.getItem("folderId")
        if (newNote.trim() !== "") {
            try {
                let data = await fetch(`${apiUrl}/notes/create-note`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folderId: id, message: newNote })
                })
                let json = await data.json()
                if (!json.success) {
                    showError("An error occurred")
                } else {
                    setNotes(prevNotes => [...prevNotes, json.data])
                    setNewNote("")

                    const textarea = document.querySelector(".folder_form_input")
                    if (textarea) {
                        textarea.style.height = "auto"
                        textarea.style.overflowY = "hidden"
                    }
                }
            } catch (err) {
                showError(err.message)
            }
        } else {
            showError("Note cannot be empty")
        }
    }


    const [activeFolderOption, setActiveFolderOption] = useState(null)

    const [isChangeNameFolderModalOpen, setIsChangeNameFolderModalOpen] = useState(false)
    const [newChangedFolderName, setNewChangedFolderName] = useState("")

    const changeFolderName = async () => {
        if (newChangedFolderName !== "") {
            try {
                let data = await fetch(`${apiUrl}/folders/change-name/${activeFolderOption}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ noteName: newChangedFolderName })
                })

                let json = await data.json()
                if (!json.success) {
                    showError("An error occurred")
                } else {
                    setIsChangeNameFolderModalOpen(false)
                    setRefreshFolders((prev) => prev + 1)
                }
            } catch (err) {
                showError(err.message)
            }
        }
    }

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");

    const saveNote = async (id) => {
        try {
            let res = await fetch(`${apiUrl}/notes/update-note/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: editedMessage })
            });
            let json = await res.json();
            if (json.success) {
                setNotes(prev =>
                    prev.map(note =>
                        note._id === id ? { ...note, message: editedMessage } : note
                    )
                );
                setEditingNoteId(null);
                setEditedMessage("");
            } else {
                showError("Xatolik yuz berdi");
            }
        } catch (err) {
            showError(err.message);
        }
    };

    useEffect(() => {
        if (editingNoteId) {
            const textarea = document.querySelector(".edit_note_textarea");
            if (textarea) {
                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";
            }
        }
    }, [editingNoteId]);

    const [responsiveHomeLeft, setResponsiveHomeLeft] = useState(false)
    const [isActiveHamburgerIcon, setIsActiveHamburgerIcon] = useState(false)
    const [isActiveHomeLeftCloseIcon, setIsActiveHomeLeftCloseIcon] = useState(false)

    const openResponsiveHomeLeft = () => {
        setResponsiveHomeLeft(true)
        setIsActiveHamburgerIcon(true)
        setIsActiveHomeLeftCloseIcon(true)
    }

    const closeResponsiveHomeLeft = () => {
        setResponsiveHomeLeft(false)
        setIsActiveHamburgerIcon(false)
        setIsActiveHomeLeftCloseIcon(false)
    }


    return (
        <div className="home_page" onClick={(e) => {
            if (!e.target.closest(".folders_box") && !e.target.closest(".modal")) {
                setActiveFolderOption(null)
            }
        }}>
            <div className="home_left" style={{ display: responsiveHomeLeft && "block" }}>
                <button style={{ display: isActiveHomeLeftCloseIcon && "block" }} className="home_left_close_icon" onClick={() => {
                    closeResponsiveHomeLeft()
                }}>
                    <i class='bxr  bx-x'  ></i>
                </button>
                <h3 className="user_name">{username}</h3>
                <div className="create_folder_btn_box">
                    <button className="create_folder_btn" onClick={() => {
                        setIsModalOpen(true)
                    }}>
                        <i className='bxr  bx-folder-plus'  ></i> Create Folder
                    </button>
                </div>

                <div className="folders_box">
                    {folders.map((folder) => <div style={{ background: activeFolder == folder._id ? "rgba(139, 92, 246, 0.4)" : "" }} key={folder._id} onClick={(e) => {
                        openFolder(folder._id)
                        closeResponsiveHomeLeft()
                        setActiveFolder(folder._id)
                    }} className="folder_item">
                        <p className="folder_title">{folder.noteName}</p>
                        <div className='bx bx-dots-horizontal-rounded folder_more_options_btn' onClick={(e) => {
                            e.stopPropagation()
                            if (activeFolderOption === folder._id) {
                                setActiveFolderOption(null)
                            } else {
                                setActiveFolderOption(folder._id)

                            }
                        }}>
                            <div id="more_options_box" className="more_options_box" style={{ display: activeFolderOption === folder._id ? "flex" : "none" }}>
                                <button className="bxr  bx-trash more_options_btn"

                                    onClick={async () => {
                                        try {
                                            let data = await fetch(`${apiUrl}/folders/delete-folder/${activeFolderOption}`, {
                                                method: "DELETE"
                                            })
                                            let json = await data.json()
                                            if (!json.success) {
                                                alert("Xatolik yuz berdi")
                                            } else {
                                                setRefreshFolders((prev) => prev + 1)
                                                setIsFolderOpen(false)
                                            }
                                        } catch (err) {
                                            console.log(err)
                                        }
                                    }}
                                ></button>
                                <button className="bxr  bx-pencil more_options_btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsChangeNameFolderModalOpen(true)
                                        setNewChangedFolderName(folder.noteName)
                                        setActiveFolderOption(folder._id)
                                    }}
                                ></button>
                            </div>
                        </div>
                    </div>)}
                </div>

                <button className="exit_button" onClick={() => {
                    localStorage.clear()
                    navigate("/login")
                }}>
                    <i className='bxr  bx-arrow-out-up-square-half bx-rotate-90'  ></i>   <p>exit</p>
                </button>
            </div>
            <div className="home_right">
                <button className="home_left_hamburger_icon" onClick={() => {
                    openResponsiveHomeLeft()
                }} style={{ display: isActiveHamburgerIcon && "none" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" stroke-linecap="round"
                        aria-hidden="true" role="img">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="home_right_box" style={{ display: isFolderOpen ? "block" : "none" }}>
                    <div className="notes_box">
                        {notes.map((note) => (
                            <div key={note._id} className="note_message">
                                {editingNoteId === note._id ? (
                                    <textarea
                                        className="edit_note_textarea"
                                        value={editedMessage}
                                        onChange={(e) => {
                                            setEditedMessage(e.target.value);
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <p className="note_p">{note.message}</p>
                                )}

                                <div className="note_options">
                                    <button
                                        onClick={async () => {
                                            try {
                                                setNotes(prevNotes => prevNotes.filter(n => n._id !== note._id))

                                                let res = await fetch(`${apiUrl}/notes/delete-note/${note._id}`, {
                                                    method: "DELETE",
                                                })
                                                let json = await res.json()

                                                if (!json.success) {
                                                    showError(json.error)
                                                    setNotes(prevNotes => [...prevNotes, note])
                                                }
                                            } catch (err) {
                                                showError(err.message)
                                                setNotes(prevNotes => [...prevNotes, note])
                                            }
                                        }}
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>


                                    {editingNoteId === note._id ? (
                                        <button onClick={() => saveNote(note._id)}>
                                            <i className='bx bx-check'></i> {/* Save icon */}
                                        </button>
                                    ) : (
                                        <button onClick={() => {
                                            setEditingNoteId(note._id);
                                            setEditedMessage(note.message);
                                        }}>
                                            <i className='bx bxs-pencil'></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}


                    </div>
                </div>

                <div className="folder_form" style={{ display: isFolderOpen ? "block" : "none" }}>
                    <div className="folder_form_box">
                        <div className="input_box folder_form_input_box">
                            <textarea
                                type="text"
                                value={newNote}
                                onChange={(e) => {
                                    setNewNote(e.target.value)
                                    e.target.style.height = "auto";
                                    let newHeight = e.target.scrollHeight;
                                    if (newHeight > 300) {
                                        newHeight = 300;
                                        e.target.style.overflowY = "auto";
                                    } else {
                                        e.target.style.overflowY = "hidden";
                                    }
                                    e.target.style.height = newHeight + "px";
                                }}
                                placeholder="name"
                                className="form_input folder_form_input"
                            />
                            <button onClick={createNote} className="folder_btn">Add</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Folder name"
                inputValue={newFolderName}
                onInputChange={(e) => setNewFolderName(e.target.value)}
                error={newFolderNameErr}
                onSubmit={handleClick}
                submitText="Create"
            />

            <Modal
                isOpen={isChangeNameFolderModalOpen}
                onClose={() => setIsChangeNameFolderModalOpen(false)}
                title="New name"
                inputValue={newChangedFolderName}
                onInputChange={(e) => setNewChangedFolderName(e.target.value)}
                error=""
                onSubmit={changeFolderName}
                submitText="Change"
            />

            <ErrModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={errModalTitle}
            />

        </div>


    );
}

export default Home;
