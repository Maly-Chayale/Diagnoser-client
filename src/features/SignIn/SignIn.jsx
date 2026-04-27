import React, { useEffect, useState } from 'react';
import axios from "axios";
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from './LogInSlice';


const SignIn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState()
    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    const [phone, setPhone] = useState()
    const [status, setStatus] = useState()

    function SignIn() {
        let newCustomer = {}
        newCustomer.name = name
        newCustomer.mail = mail
        newCustomer.password = password
        newCustomer.phone = phone
        newCustomer.status = status
        dispatch(signIn(newCustomer))
        navigate("../enter")
    }

    const onSignInClick = () => {
        navigate("../LogIn")
    }

    return (
        <div className='col'>
            <input value={name} onChange={(e) => { setName(e.target.value) }} placeholder='name' type='text'></input>
            <input value={mail} onChange={(e) => { setMail(e.target.value) }} placeholder='Mail' type='mail'></input>
            <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder='phone' type='number'></input>
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='password' type='password'></input>
            <select onChange={(e) => { setStatus(e.target.value) }} placeholder="סוג לקוח">
                <option value={1}>מוסד</option>
                <option value={2}>משפחה</option>
                <option value={3}>פרטי</option>
            </select>
            <button className="primary-btn" onClick={() => { SignIn() }}>OK</button>
            <button className="primary-btn" onClick={onSignInClick}> התחברות </button>
        </div>

    )

}
export default SignIn;