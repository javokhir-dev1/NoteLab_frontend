import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect } from "react";


function Otp() {
    useEffect(() => {
        document.title = "Otp";
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
                <h2 className="login_title">Sign up</h2>
                <div className="input_box">
                    <input type="text" placeholder="Otp code" style={{}} className="form_input hide-scroll" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>

                <button className="form_btn">Next</button>
                <p className="login_link">Already have an accaunt? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Otp