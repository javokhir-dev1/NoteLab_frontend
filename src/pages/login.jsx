import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect } from "react";


function Login() {
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
                    <input type="text" placeholder="Username or email" className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-user'  ></i> </span>
                </div>

                <div className="input_box">
                    <input type="password" placeholder="Password" className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>

                <button className="form_btn">Login</button>
                <p className="login_link">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    )
}

export default Login