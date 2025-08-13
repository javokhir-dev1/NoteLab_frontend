import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL;

import "./css/home.css"

function Home() {
    const token = JSON.parse(localStorage.getItem("token"))
    const [user, setUser] = useState({ email: "", username: "" })
    const [folders, setFolders] = useState([])

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
    }, [navigate])


    return (
        <div className="home_page">
            <div className="home_left">

                <h3 className="user_name">{username}</h3>
                <div className="create_folder_btn_box">
                    <button className="create_folder_btn">
                        <i class='bxr  bx-folder-plus'  ></i> Create Folder
                    </button>
                </div>

                <div className="folders_box">
                    {folders.map((folder) => <div key={folder._id} className="folder_item">{folder.noteName}</div>)}
                </div>
            </div>
            <div className="home_right"></div>
        </div>


    );
}

export default Home;
