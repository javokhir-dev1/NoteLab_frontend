import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Home from "./pages/home"
import SignUp from "./pages/signup"
import NotFound from "./pages/notFound"
import Otp from "./pages/otp"
import CreateUser from "./pages/createUser"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
