import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import { logIn, signOut } from './LogInSlice';
import { ProfilelogIn } from '../Profile/ProfileSlice';
import { InitCustomer } from '../Customers/CustomerSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import { InitLeads } from '../Leads/LeadsSlice';

import styles from './LogIn.module.css';

const LogIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customers = useSelector(state => state.Customer.Customers);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const leads = useSelector(state => state.Lead.Leads);

    const statusL = useSelector(state => state.Lead.status);
    const statusC = useSelector(state => state.Customer.status);
    const statusD = useSelector(state => state.Diagnoser.status);

    const thisuser = useSelector(state => state.LogIn.thisUser);
    const status = useSelector(state => state.LogIn.statusUser);

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(false);

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            SignIn();
        }
    };

    useEffect(() => {
        if (statusC === "") dispatch(InitCustomer());
        if (statusD === "") dispatch(InitDiagnoser());
        if (statusL === "") dispatch(InitLeads());
    }, [statusC, statusD, statusL, thisuser, dispatch]);

    useEffect(() => {
        if (status === "wrong") {
            setErr(true);
            dispatch(signOut())
        }
        else if (status) {  // או הערך שמציין הצלחה
            navigate("../hello");
            dispatch(ProfilelogIn({
                thisUser: thisuser,  // הערכים המעודכנים
                status: status
            }));
        }
    }, [status, navigate]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Enter") {
                SignIn();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);
    }, [mail, password]);

    async function SignIn() {
        const result = await dispatch(logIn({
            user: { mail, password },
            Customers: customers,
            Diagnosers: diagnosers,
            Leads: leads
        }));
    }

    const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const email = decoded.email;

        const userExists =
            customers.find(c => c.mail === email) ||
            diagnosers.find(d => d.mail === email) ||
            leads.find(l => l.mail === email);

        if (userExists) {
            dispatch(logIn({
                user: { mail: email, password: null },
                Customers: customers,
                Diagnosers: diagnosers,
                Leads: leads
            }));
            navigate("../hello");
        } else {
            setErr(true);
            dispatch(signOut())
        }
    };

    if (statusC == "" || statusD == "" || statusL == "") return <>טוען נתונים...</>
    // if(statusC.length|| statusD.length|| statusL.length) return <>טוען נתונים...</>

    return (
        <div
            className={styles.container}
            onKeyDown={handleEnter}
            tabIndex={0}
        >
            <div className={styles.card}>

                <h2 className={styles.title}>התחברות</h2>

                <input
                    className={styles.inputField}
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="אימייל"
                    type="email"
                />

                <input
                    className={styles.inputField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="סיסמה"
                    type="password"
                />

                {err && <div className={styles.errorMessage}>שגיאה בהתחברות</div>}

                <button className={styles.button} onClick={SignIn}>
                    התחברות
                </button>

                <button
                    className={styles.secondaryButton}
                    onClick={() => navigate("../SignIn")}
                >
                    הרשמה
                </button>

                <div className={styles.googleBox}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => { setErr(true); dispatch(signOut()) }}
                    />
                </div>

            </div>
        </div>
    );
};

export default LogIn;