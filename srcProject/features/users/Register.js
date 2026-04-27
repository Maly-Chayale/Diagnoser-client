// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { onUserLoggedIn, onUserRegistered } from './usersSlice';
// import { Link, useNavigate } from 'react-router-dom';
// import { onUserRegister } from './userSlice';
// import { onUserLoggedIn } from './usersSlice';


import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onUserRegister } from './usersSlice';
// import { onUserRegister } from './userSlice';
import { Link } from 'react-router-dom';




const Register = () => {
    const users = useSelector((state) => state.users.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userName, setUserName] = useState("");



    const onEmailChang = (e) => setUserEmail(e.target.value);
    const onPasswordChang = (e) => setUserPassword(e.target.value);
    const onUserNameChang = (e) => setUserName(e.target.value);

    const onRegister = () => {

        const user = users.find(u => u.email === userEmail);

        if (user != undefined)
            alert("האימייל כבר קיים במערכת");

        else
            alert("התחברת בהצלחה");

        const newUser = {
            id: users.length + 1,
            username: userName,
            password: userPassword,
            email: userEmail,
            favorites:[]

        }
        dispatch(onUserRegister(newUser));
        navigate("/user-profile");
    }
    return (
        <div>
            <form>
                <h1>הרשמה</h1>
                <label>שם משתמש</label>
                <input type="text" name="username" onChange={onUserNameChang} />
                <label>אימייל </label>
                <input type="email" name="email" onChange={onEmailChang} />
                <label>סיסמא </label>
                <input type="password" name="pasword" onChange={onPasswordChang} />
                <Link to="Link">למעבר להתחברות</Link>
                {/* <p>למעבר להתחברות</p> */}
                <button type="button" onClick={() => { onRegister() }}>הרשם</button>
            </form>

        </div>

    )
}

export default Register