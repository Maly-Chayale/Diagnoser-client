import React, { useEffect, useState } from 'react';
import { InitCustomer } from '../Customers/CustomerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from './LogInSlice';
import { ProfilelogIn } from '../Profile/ProfileSlice';

const LogIn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const customers = useSelector(state => state.Customer.Customers)
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
    const statusC = useSelector(state => state.Customer.status)
    const statusD = useSelector(state => state.Diagnoser.status)

    const thisuser = useSelector(state=>state.LogIn.thisUser)
    const status = useSelector(state=>state.LogIn.statusUser)

    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    const [err, setErr] = useState(false)


    useEffect(() => {
        if (statusC == "")
            dispatch(InitCustomer())
        dispatch(ProfilelogIn({
            thisUser:thisuser,
            status: status
        }))
    }, [statusC, statusD, dispatch])

    async function SignIn(){
        // console.log(customers);
        // let customerIndex = customers.findIndex(c => c.mail == mail && c.password == parseInt(password))
        // if (customerIndex != -1) {
        await dispatch(logIn({
            user: {
                password: password,
                mail: mail
            },
            Customers: customers,
            Diagnosers: diagnosers
        }))
        // setTimeout(
        //  dispatch(ProfilelogIn({
        //     thisUser:thisuser,
        //     status: status
        // })),5000)
        dispatch(ProfilelogIn({
            thisUser:thisuser,
            status: status
        }))
        navigate("../enter")
        // }
        // else {
        //     setErr(true);
        // }
    }

    const onSignInClick = () => {
        navigate("../SignIn")
    }


    return (
        <div className='col'>
            <input value={mail} onChange={(e) => { setMail(e.target.value) }} placeholder='Mail' type='mail'></input>
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='password' type='password'></input>
            <button className="primary-btn" onClick={() => { SignIn() }}>OK</button>
            <button className="primary-btn" onClick={onSignInClick}> הרשמה </button>
            {err && <p> אחד מהנתונים שהזנת שגוי אנא הרשם מחדש</p>}
        </div>
    )

}
export default LogIn;