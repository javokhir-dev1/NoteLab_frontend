import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect, useState } from "react"
const apiUrl = import.meta.env.VITE_API_URL;


function CreateUser() {
    let navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [usernameErr, setUsernameErr] = useState()
    const [passwordErr, setPasswordErr] = useState()
    const [passwordErr2, setPasswordErr2] = useState()

    const re = /^(?=.*[A-Z])(?=.*[1-9])[A-Za-z1-9]{6,}$/;

    const handleClick = async () => {
        const errors = {
            username: "",
            password: "",
            password2: ""
        };

        if (!username) errors.username = "Username required";
        if (!password) errors.password = "Password required";
        else if (!re.test(password))
            errors.password = "Password must be at least 6 chars, include 1 uppercase and 1 number";

        if (password && password2 && password !== password2)
            errors.password2 = "Passwords do not match";

        setUsernameErr(errors.username);
        setPasswordErr(errors.password);
        setPasswordErr2(errors.password2);

        if (!errors.username && !errors.password && !errors.password2) {
            let { email } = JSON.parse(localStorage.getItem("user"))

            try {
                let data = await fetch(`${apiUrl}/users/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, username, password })
                })

                let json = await data.json()
                if (json.success) {
                    navigate("/login")
                } else {
                    setPasswordErr(json.error)
                }
            } catch (err) {
                console.log(err)
            }
        }
    };


    useEffect(() => {
        let tokenLocal = localStorage.getItem("token")
        if (tokenLocal) {
            navigate("/")
        }
    }, [])
    return (
        <div className="login_page">
            <div className="login_box">
                <h2 className="login_title">Create User</h2>
                <div className="input_box">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form_input hide-scroll" />
                    <span className="input_icon"><i className='bxr  bxs-user'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{usernameErr}</p>


                <div className="input_box">
                    <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form_input hide-scroll" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{passwordErr}</p>

                <div className="input_box">
                    <input type="text" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} className="form_input hide-scroll" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{passwordErr2}</p>


                <button className="form_btn" onClick={handleClick}>Next</button>
                <p className="login_link">Already have an accaunt? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default CreateUser