

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiagnoser, InitDiagnoser } from './DiagnoserSlice';
import "./Diagnoser.css";
import AddDiagnosticianPopup from './AddDiagnosticianPopup';
import { useNavigate } from 'react-router-dom';

const DiagnoserList = () => {
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const status = useSelector(state => state.Diagnoser.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const statusUser = useSelector(state => state.LogIn.statusUser);

    const handleSave = (data) => {
        console.log("New diagnostician:", data);
        console.log(diagnosers);
    };
    const string = (s) => {
        let str = s.name + " " + s.mail
        if (s.graphology)
            str += " גרפולוגיה"
        if (s.morphology)
            str += " מורפולוגיה"
        if (s.chirology)
            str += " כירולוגיה"
        return str
    }

    const [search, setSearch] = useState("");


    useEffect(() => {
        if (status === "" || status === "faild") dispatch(InitDiagnoser());
    }, [status, dispatch]);

    const Delete = (d) => {
        dispatch(deleteDiagnoser(d));
        setConfirmDelete(null); // סגירת הפופאפ
    };

    const filtered = diagnosers?.filter((d) => {
        if (filter === "all") return true;
        // if (!d.available) return false;
        if (filter === "available" && d.available) return true;
        if (filter === "Morfology" && d.morphology) return true;
        if (filter === "Chirology" && d.chirology) return true;
        if (filter === "Grafology" && d.graphology) return true;
        return false;
    });


    const final = filtered?.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase()))


    if (status === "" || status === "loading") return <div id="text">טוען נתונים...</div>;
    if (status === "faild") return <div id="text">נכשל</div>;

    return (
        <div className="diagnosticians-page">
            <h1 className="title">רשימת מאבחנות</h1>
            <div className="search-row">
                <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filters-row">
                <label className="filter-label">
                    סינון:
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">הכל</option>
                        <option value="available">זמינה</option>
                        <option value="Grafology">גרפולוגיה</option>
                        <option value="Morfology">מורפולוגיה</option>
                        <option value="Chirology">כירולוגיה</option>
                    </select>
                </label>
            </div>

            <div className="cards-grid">
                {final.map((d) => (
                    <div key={d.mail} className="card">
                        <div className="card-header">
                            <h2 className="name">{d.name}</h2>
                            {d.morphology && <span className="badge">מורפולוגית</span>}
                            {d.graphology && <span className="badge">גרפולוגית</span>}
                            {d.chirology && <span className="badge">כירולוגית</span>}
                        </div>
                        <p className="description">צרו קשר:</p>
                        <p className="description">{d.mail}</p>
                        <p className="description">{d.phone}</p>
                        {d.available ? <span className="badge">זמינה</span> : <span className="badge">לא זמינה כרגע</span>}

                        <button
                            className="primary-btn1"
                            onClick={() => navigate(`/DiagnoserDetails/${diagnosers.find(diag => diag.mail === d.mail).code}`)}
                        >
                            פרטים נוספים
                        </button>

                        {statusUser === "Esty" && (
                            <button className="primary-btn1" onClick={() => setConfirmDelete(d)}>
                                למחיקה
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* פופאפ לאישור מחיקה */}
            {confirmDelete && (
                <div className="confirm-popup">
                    <div className="confirm-content">
                        <p>האם אתה בטוח שברצונך למחוק את {confirmDelete.name}?</p>
                        <div className="confirm-buttons">
                            <button className="primary-btn" onClick={() => Delete(confirmDelete)}>אישור</button>
                            <button className="primary-btn" onClick={() => setConfirmDelete(null)}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}

            {statusUser === "Esty" && (
                <button className="primary-btn2" onClick={() => setOpen(true)}>
                    הוספת מאבחנת
                </button>
            )}

            <AddDiagnosticianPopup isOpen={open} onClose={() => setOpen(false)} onSave={handleSave} />
        </div>
    );
};

export default DiagnoserList;