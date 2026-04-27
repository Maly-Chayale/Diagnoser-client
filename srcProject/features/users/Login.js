import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { onUserLoggedIn } from './usersSlice';
import { Link, useNavigate } from 'react-router-dom';
// import { Link, Route, Routes } from 'react-router-dom';


const Login = () => {

  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const onEmailChang = (e) => setUserEmail(e.target.value);
  const onPasswordChang = (e) => setUserPassword(e.target.value);

  const onLogin = () => {

    const user = users.find(u=>u.email === userEmail && u.password === userPassword);
     
    if(user === undefined)
      alert("אחד הפרטים שהוזנו שגויים");
    else
    alert("התחברת בהצלחה");
    dispatch( onUserLoggedIn(user));
    navigate("/user-profile");
  }

  return (

    <div>
      <form>
        <h1>התחברות</h1>
        <label>אימייל </label>
        <input type="email" name="email" onChange={onEmailChang} />
        <label>סיסמא </label>
        <input type="password" name="pasword" onChange={onPasswordChang} />
        {/* <p>למעבר להרשמה</p> */}
         <Link to="register">למעבר להרשמה</Link>
        <button type="button" onClick={() => { onLogin(); }}>התחבר</button>
      </form>
    </div>
  )
}

export default Login