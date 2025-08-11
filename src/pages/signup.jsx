import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect } from "react"


function Signup() {
    let navigate = useNavigate()
    let handleClick = () => {
        navigate("/otp")
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
                <h2 className="login_title">Sign up</h2>
                <div className="input_box">
                    <input type="text" placeholder="email" className="form_input" />
                    <span className="input_icon"><i className='bxr  bxs-user'  ></i> </span>
                </div>

                <button className="form_btn" onClick={handleClick}>Next</button>
                <p className="login_link">Already have an accaunt? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Signup