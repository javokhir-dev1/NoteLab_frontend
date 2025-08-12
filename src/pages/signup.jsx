import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./css/login.css"

const apiUrl = import.meta.env.VITE_API_URL;

function Signup() {
    const [email, setEmail] = useState("")
    const [emailErrInfo, setEmailErrInfo] = useState("")


    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    let navigate = useNavigate()
    let handleClick = async () => {
        if (email === "") {
            setEmailErrInfo("Email required")
        } else if (!re.test(email)) {
            setEmailErrInfo("Invalid email")
        } else {
            setEmailErrInfo("");
            try {
                const res = await fetch(`${apiUrl}/users/otp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem("user", JSON.stringify({ email }))
                    navigate("/otp");
                } else {
                    setEmailErrInfo(data.error)
                }
            } catch (err) {
                console.error("Xatolik:", err);
            }
        }
    }

    useEffect(() => {
        document.title = "Sign up";
    }, []);

    useEffect(() => {
        let tokenLocal = localStorage.getItem("token")
        if (tokenLocal) {
            navigate("/")
        }
    }, [])


    return (
        <div className="login_page">
            <div className="login_box">
                <h2 className="login_title">Enter email</h2>
                <div className="input_box">
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-user'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{emailErrInfo}</p>

                <button className="form_btn" onClick={handleClick}>Next</button>
                <p className="login_link">Already have an accaunt? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Signup