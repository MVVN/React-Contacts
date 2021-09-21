import { useRef } from 'react';
import * as Mui from '@material-ui/icons';
import axios from "axios"

import "./Login.css";

export default function Login({ setShowLogin, setCurrentUser, setCurrentUserID, setViewport, setIsAdmin}) {

    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const response = await axios.post("/login", user);
            setCurrentUser(response.data.user.username);
            setCurrentUserID(response.data.user._id);
            setIsAdmin(response.data.user.isAdmin);
            // console.log("response", response);
            localStorage.setItem("user", response.data.user.username);
            localStorage.setItem("userid", response.data.user._id);
            localStorage.setItem("isadmin", response.data.user.isAdmin);
            setShowLogin(false);
            setViewport({
                width: "100vw",
                height: "100vh",
                latitude: 52.520008,
                longitude: 13.404954,
                zoom: 11
            });
        } catch (err) {
            alert("Login failed.");
        }
    }

    return (
        <div className="lgn-darkBG">
            <div className="loginContainer">
                <div className="lgn-logo"><Mui.LockOpen style={{ fontSize: 37 }} /></div>
                <form className="lgn-form" onSubmit={handleSubmit}>
                    <input className="lgn-input" type="text" placeholder="username" ref={usernameRef} />
                    <input className="lgn-input" type="password" placeholder="password" ref={passwordRef} />
                    <button className="lgn-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}
