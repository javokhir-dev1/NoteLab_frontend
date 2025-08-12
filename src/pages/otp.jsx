import { Link, useNavigate } from "react-router-dom"
import "./css/login.css"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;


function Otp() {
    const [otp, setOtp] = useState("")
    const [emailErrInfo, setEmailErrInfo] = useState("")
    let navigate = useNavigate()

    const handleClick = async () => {
        if (otp === "") {
            setEmailErrInfo("Enter OTP")
        } else {
            try {
                const data = await fetch(`${apiUrl}/users/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "code": otp })
                })

                const json = await data.json()

                if (json.success) {
                    navigate("/createuser")
                } else {
                    setEmailErrInfo(json.error)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }


    useEffect(() => {
        document.title = "Otp";
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
                <h2 className="login_title">Enter otp</h2>
                <div className="input_box">
                    <input type="text" placeholder="Otp code" onChange={(e) => setOtp(e.target.value.trim())} className="form_input hide-scroll" />
                    <span className="input_icon"><i className='bxr  bxs-lock'  ></i> </span>
                </div>
                <p style={{ fontSize: 14, color: "red", marginLeft: 10 }}>{emailErrInfo}</p>

                <button className="form_btn" onClick={handleClick}>Check otp</button>
                <p className="login_link">Already have an accaunt? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Otp