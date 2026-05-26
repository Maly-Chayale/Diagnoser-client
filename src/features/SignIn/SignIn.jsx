import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addLead, signIn, signOut } from './LogInSlice';
import { TypeGroups } from '../TypeGroup/TypeGroupSlice';
import { InitCustomer } from '../Customers/CustomerSlice';
import { ProfilelogIn } from '../Profile/ProfileSlice';
import { InitLeads } from '../Leads/LeadsSlice';
import styles from './LogIn.module.css';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';

const SignIn = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const typeGroups = useSelector(state => state.TypeGroup.groups);
    const statusType = useSelector(state => state.TypeGroup.statusType);
    const customers = useSelector(state => state.Customer.Customers);
    const leads = useSelector(state => state.Lead.Leads);
    const statusC = useSelector(state => state.Customer.status);
    const statusL = useSelector(state => state.Lead.status);

    const thisuser = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState(1);
    const [err, setErr] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusC === "faild" || statusC === "")
                    await dispatch(InitCustomer()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusC, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusL === "faild" || statusL === "")
                    await dispatch(InitLeads()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusL, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusType === "faild" || statusType === "")
                    await dispatch(TypeGroups()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusType, dispatch]);

    useEffect(() => {
        dispatch(ProfilelogIn({
            thisUser: thisuser,
            status: statusUser
        }));
    }, [thisuser, statusUser])

    async function SignInHandler() {
        setErr(false);

        let newCustomer = {
            name,
            mail,
            password,
            phone,
            codeType: status
        };

        let c = customers.find(c => c.mail === mail.toLowerCase());
        let l = leads.find(l => l.mail === mail.toLowerCase());

        if (c || l) {
            dispatch(signOut())
            setErr(true);
            return;
        }

        dispatch(signIn(newCustomer));
        await dispatch(addLead(newCustomer)).unwrap();
        navigate("../AI");
    }

    const isFormValid = name && mail && password && phone && status;

    if (statusC !== "succesfull" || statusType !== "succesfull" || statusL !== "succesfull") return <>טוען נתונים...</>

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h2 className={styles.title}>הרשמה</h2>

                <input className={styles.inputField}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="שם"
                />

                <input className={styles.inputField}
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="אימייל"
                />

                <input className={styles.inputField}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="טלפון"
                />

                <input className={styles.inputField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="סיסמה"
                />

                <select
                    className={styles.inputField}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {typeGroups.map(t => (
                        <option key={t.code} value={t.code}>
                            {t.description}
                        </option>
                    ))}
                </select>

                {err && <div className={styles.errorMessage}>מייל כבר קיים</div>}

                <button
                    className={styles.button}
                    onClick={SignInHandler}
                    disabled={!isFormValid}
                >
                    הרשמה
                </button>

                <button
                    className={styles.secondaryButton}
                    onClick={() => navigate("../LogIn")}
                >
                    יש לי חשבון
                </button>

            </div>
        </div>
    );
};

export default SignIn;