import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL;

import "./css/home.css"

function Home() {
    const token = JSON.parse(localStorage.getItem("token"))
    const [user, setUser] = useState({ email: "", username: "" })
    const [folders, setFolders] = useState([])
    const [refreshFolders, setRefreshFolders] = useState(0);

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
                    console.log(err)
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
                    alert("Folder qo'shildi!")
                    setIsModalOpen(false)
                    setNewFolderName("")
                } else {
                    alert("Folder qo'shishda xatolik!")
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const [isFolderOpen, setIsFolderOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [notes, setNotes] = useState([])

    const openFolder = async (id) => {
        localStorage.setItem("folderId", id)
        setIsFolderOpen(true)
        try {
            let data = await fetch(`${apiUrl}/folders/show-folder/${id}`)
            let json = await data.json()
            console.log(json)
            setFolderName(json.folder.noteName)
            setNotes(json.notes)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="home_page">
            <div className="home_left">

                <h3 className="user_name">{username}</h3>
                <div className="create_folder_btn_box">
                    <button className="create_folder_btn" onClick={() => setIsModalOpen(true)}>
                        <i className='bxr  bx-folder-plus'  ></i> Create Folder
                    </button>
                </div>

                <div className="folders_box">
                    {folders.map((folder) => <div key={folder._id} onClick={(e) => openFolder(folder._id)} className="folder_item"><p>{folder.noteName}</p><i className='bxr  bx-folder'  ></i> </div>)}
                </div>
            </div>
            <div className="home_right">
                <div className="home_right_box" style={{ display: isFolderOpen ? "block" : "none" }}>
                    <h3 className="folder_name">{folderName}</h3>
                    <div className="notes_box">
                        {notes.map((note) => {
                            return <div key={note._id} className="note_message"><p>{note.message}</p></div>
                        })}

                    </div>
                </div>

                <div className="folder_form" style={{ display: isFolderOpen ? "block" : "none" }}>
                    <div className="folder_form_box">
                        <div className="input_box folder_form_input_box">
                            <textarea
                                type="text"
                                onChange={(e) => {
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
                            <button className="folder_btn">Add</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal" style={{ display: !isModalOpen ? "none" : "flex" }}>
                <div className="modal_box">
                    <button className="modal_close" onClick={() => setIsModalOpen(false)}><i className='bxr  bxs-x'  ></i> </button>
                    <h2 className="modal_title">Folder name</h2>
                    <div className="input_box">
                        <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="name" className="form_input" />
                        <span className="input_icon"><i className='bxr  bxs-pencil'  ></i>  </span>
                    </div>
                    <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{newFolderNameErr}</p>


                    <button className="form_btn" onClick={handleClick}>Create</button>
                </div>
            </div>

        </div>


    );
}

export default Home;
