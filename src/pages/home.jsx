import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
    let [token, setToken] = useState(null)
    let navigate = useNavigate()
    useEffect(() => {
        let tokenLocal = localStorage.getItem("token")
        if (!tokenLocal) {
            navigate("/login")
        } else {
            setToken(tokenLocal)
        }
    }, [])
    return (
        <>{token}</>
    )
}

export default Home