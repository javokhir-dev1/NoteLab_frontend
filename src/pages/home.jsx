import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
    const [user, setUser] = useState({email: "", username: ""})
    const navigate = useNavigate()
    const token = JSON.parse(localStorage.getItem("token"))
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
        }
    }, [token, navigate])

    return (
        <div>
            {user.username}<br/>
            {user.email}
        </div>
    );
}

export default Home;
