import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailErr, setEmailErr] = useState()
    const [passwordErr, setPasswordErr] = useState()

    const handleClick = async () => {
        setEmailErr("")
        setPasswordErr("")

        if (email === "") {
            setEmailErr("Enter email")
        }

        if (password === "") {
            setPasswordErr("Enter password")
        }

        if (email !== "" && password !== "") {
            try {
                let data = await fetch(`${apiUrl}/users/login`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password})
                })

                let json = await data.json()
                if (json.success) {
                    localStorage.setItem("token", JSON.stringify(json))
                    navigate("/")
                } 
            } catch(err) {
                console.log(err)
            }
        }

    }

    useEffect(() => {
        document.title = "Login";
    }, []);

    let navigate = useNavigate()
    useEffect(() => {
        let tokenLocal = localStorage.getItem("token")
        if (tokenLocal) {
            navigate("/")
        }
    }, [])

    return (
        <div className="login_page">
            <div className="login_box">
                <h2 className="login_title">Login</h2>
                <div className="input_box">
                    <input type="text" placeholder="Username or email" value={email} onChange={(e) => setEmail(e.target.value)} className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-user'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{emailErr}</p>


                <div className="input_box">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{passwordErr}</p>


                <button className="form_btn" onClick={handleClick}>Login</button>
                <p className="login_link">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    )
}

export default Login