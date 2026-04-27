import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCard from '../WorkShop/AppointmentCard'
import { getType, InitWorkShops } from '../WorkShop/WorkShopSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import { fetchTypeGroups } from '../TypeGroup/TypeGroupSlice';

import "./css.css";
const Home = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSignInClick = () => {
        navigate("../SignIn")
    }

    const onLogInClick = () => {
        navigate("../LogIn")
    }

    const thisUser = useSelector(state => state.LogIn.thisUser)
    const statusUser = useSelector(state => state.LogIn.statusUser)

    const diagnosticians = useSelector(state => state.Diagnoser.Diagnosers)
    const slots = useSelector(state => state.WorkShop.WorkShops)
    const status = useSelector(state => state.WorkShop.status)
    const statusD = useSelector(state => state.Diagnoser.status)



    useEffect(() => {
        const load = async () => {
            await dispatch(fetchTypeGroups())
            await dispatch(InitDiagnoser());
            await dispatch(InitWorkShops());
        };
        load();
    }, [dispatch]);


    const string = (d) => {
        let string = d.name + " " + d.mail + " " + d.phone
        if (d.graphology)
            string += "גרפולוגיה"
        if (d.morphology)
            string += "מורפולוגיה"
        if (d.chirology)
            string += "כירולוגיה"
        if (d.available)
            string += "זמינה"
        return string
    }

    const string2 = (s) => {
        let string = dispatch(getType(s)).arg.description
        if (s.graphology)
            string += " גרפולוגיה"
        if (s.morphology)
            string += " מורפולוגיה"
        if (s.chirology)
            string += "כירולוגיה"
        return string
    }

    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(() =>
        slots.filter(s => (string2(s)).toLowerCase().includes(search.toLowerCase())), [slots, search]);

    const filteredDiagnosticians = useMemo(() =>
        diagnosticians.filter(d => (string(d)).toLowerCase().includes(search.toLowerCase()))
        , [diagnosticians, search]);
    return (
        <div className="diagnosticians-page">

            <header className="home-header">
                <div>
                    <h1 className="title">הזמנת אבחונים במורפולוגיה וגרפולוגיה</h1>
                    <p className="subtitle"> בחרי מאבחנת, מצאי תור פנוי והזמיני אבחון מותאם אישית - הכול במקום אחד. </p>
                </div>
                <div class="login">
                    {thisUser == null && <button className="primary-btn" onClick={onSignInClick}> הרשמה </button>}
                    {thisUser == null && <button className="primary-btn" onClick={onLogInClick}> התחברות </button>}
                </div>
                {thisUser != null && <h1>שלום ל{thisUser.name}  {statusUser}</h1>}
            </header>
            <div className="search-row">
                <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <section className="section">
                <h2 className="section-title">  סדנאות  </h2>
                <div className="cards-grid"> {
                    filteredSlots?.map(w =>
                        <div>
                            <AppointmentCard WorkShop={w} />
                        </div>
                    )}
                    {
                        filteredSlots.length === 0 && (
                            <p className="empty-text">לא נמצאו תורים פנויים מתאימים לחיפוש.</p>
                        )}
                </div>
            </section>
            <section className="section">
                <h2 className="section-title">מאבחנות</h2>
                <div className="cards-grid">
                    <div className="cards-grid">
                        {filteredDiagnosticians?.map((d) => (<div key={d.mail} className="card">
                            <div className="card-header">
                                <h2 className="name">{d.name}</h2>
                                {d.morphology && <span className="badge">מורפולוגית</span>}
                                {d.graphology && <span className="badge">גרפולוגית</span>}
                                {d.chirology && <span className="badge">כירולוגית</span>}
                            </div>
                            <p className="description">צרו קשר:</p>
                            <p className="description">{d.mail}</p>
                            <p className="description">{d.phone}</p>
                            {d.available ? <span className="badge">זמינה</span> :
                                <span className="badge">לא זמינה כרגע</span>}
                            <button className="primary-btn" onClick={() => navigate(`/DiagnoserDetails/${(diagnosticians.find(diag => diag.mail == d.mail).code)}`)} >פרטים נוספים</button>
                        </div>
                        ))}
                        {filteredDiagnosticians.length === 0 && (
                            <p className="empty-text">לא נמצאו מאבחנות מתאימות לחיפוש.</p>
                        )}
                    </div>

                </div>
            </section>
        </div>);
}
export default Home;