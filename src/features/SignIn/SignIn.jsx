// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import './style.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { addLead, signIn } from './LogInSlice';
// import { fetchTypeGroups } from '../TypeGroup/TypeGroupSlice';
// import { InitCustomer } from '../Customers/CustomerSlice';
// import { ProfilelogIn } from '../Profile/ProfileSlice';


// const SignIn = () => {

//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const typeGroups = useSelector(state => state.TypeGroup.groups)
//     const statusType = useSelector(state => state.TypeGroup.status)
//     const customers = useSelector(state => state.Customer.Customers)
//     const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
//     const statusC = useSelector(state => state.Customer.status)
//     const statusD = useSelector(state => state.Diagnoser.status)
//     const thisuser = useSelector(state => state.LogIn.thisUser)
//     const statusUser = useSelector(state => state.LogIn.statusUser)

//     const [name, setName] = useState()
//     const [mail, setMail] = useState()
//     const [password, setPassword] = useState()
//     const [phone, setPhone] = useState()
//     const [status, setStatus] = useState(1)

//     const [err, setErr] = useState(false)

//     useEffect(() => {
//         if (statusType == "")
//             dispatch(fetchTypeGroups())
//     }, [dispatch, statusType])

//     useEffect(() => {
//         if (statusC == "")
//             dispatch(InitCustomer())
//         dispatch(ProfilelogIn({
//             thisUser: thisuser,
//             status: statusUser
//         }))
//     }, [statusC, statusD, dispatch])

//     function SignIn() {
//         setErr(false)
//         let newCustomer = {}
//         newCustomer.name = name
//         newCustomer.mail = mail
//         newCustomer.password = password
//         newCustomer.phone = phone
//         newCustomer.codeType = status
//         let c = customers.find(c => c.mail == mail)
//         let d = diagnosers.find(c => c.mail == mail)
//         if (c || d)
//             setErr(true)
//         else {
//             dispatch(signIn(newCustomer))
//             dispatch(addLead(newCustomer))
//             navigate("../enter")
//         }
//     }

//     const onSignInClick = () => {
//         navigate("../LogIn")
//     }

//     if (typeGroups.length == 0) return <>טוען נתונים...</>

//     return (
//         <div className='col'>
//             <input value={name} onChange={(e) => { setName(e.target.value) }} placeholder='name' type='text'></input>
//             <input value={mail} onChange={(e) => { setMail(e.target.value) }} placeholder='Mail' type='mail'></input>
//             <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder='phone' type='number'></input>
//             <input value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='password' type='password'></input>
//             <select value={status} onChange={(e) => { setStatus(e.target.value) }} placeholder="סוג לקוח">
//                 {
//                     typeGroups.map(t => (
//                         <option key={t.code} value={t.code}>{t.description}</option>
//                     ))
//                 }
//                 {/* <option value={1}>מוסד</option>
//                 <option value={2}>משפחה</option>
//                 <option value={3}>פרטי</option> */}
//             </select>
//             {err && <div>מייל זה כבר רשום במערכת.</div>}
//             <button className="primary-btn" onClick={() => { SignIn() }}>OK</button>
//             <button className="primary-btn" onClick={onSignInClick}> התחברות </button>
//         </div>

//     )

// }
// export default SignIn;




import React, { useEffect, useState } from 'react';
import axios from "axios";
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addLead, signIn } from './LogInSlice';
import { fetchTypeGroups } from '../TypeGroup/TypeGroupSlice';
import { InitCustomer } from '../Customers/CustomerSlice';
import { ProfilelogIn } from '../Profile/ProfileSlice';


const SignIn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const typeGroups = useSelector(state => state.TypeGroup.groups)
    const statusType = useSelector(state => state.TypeGroup.status)
    const customers = useSelector(state => state.Customer.Customers)
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
    const statusC = useSelector(state => state.Customer.status)
    const statusD = useSelector(state => state.Diagnoser.status)
    const thisuser = useSelector(state => state.LogIn.thisUser)
    const statusUser = useSelector(state => state.LogIn.statusUser)

    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [status, setStatus] = useState(1)

    const [err, setErr] = useState(false)

    useEffect(() => {
        if (statusType === "")
            dispatch(fetchTypeGroups())
    }, [dispatch, statusType])

    useEffect(() => {
        if (statusC === "")
            dispatch(InitCustomer())
        dispatch(ProfilelogIn({
            thisUser: thisuser,
            status: statusUser
        }))
    }, [statusC, statusD, dispatch])

    function SignIn() {
        setErr(false)
        let newCustomer = {
            name,
            mail,
            password,
            phone,
            codeType: status
        }
        let c = customers.find(c => c.mail === mail)
        let d = diagnosers.find(c => c.mail === mail)
        if (c || d)
            setErr(true)
        else {
            dispatch(signIn(newCustomer))
            dispatch(addLead(newCustomer))
            navigate("../enter")
        }
    }

    const onSignInClick = () => {
        navigate("../LogIn")
    }

    // בדיקה אם כל השדות מלאים
    const isFormValid = name && mail && password && phone && status

    if (statusType === "loading") return <>טוען נתונים...</>

    return (
        <div className='col'>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='name' type='text'></input>
            <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder='Mail' type='mail'></input>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='phone' type='number'></input>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' type='password'></input>
            <select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="סוג לקוח">
                {
                    typeGroups.map(t => (
                        <option key={t.code} value={t.code}>{t.description}</option>
                    ))
                }
            </select>
            {err && <div>מייל זה כבר רשום במערכת.</div>}
            <button className="primary-btn"
                onClick={() => SignIn()}
                disabled={!isFormValid}>OK</button>
            <button className="primary-btn" onClick={onSignInClick}> התחברות </button>
        </div>
    )

}
export default SignIn;