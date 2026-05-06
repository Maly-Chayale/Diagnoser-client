import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiagnoser, InitDiagnoser } from './DiagnoserSlice';
import AddDiagnosticianPopup from './AddDiagnosticianPopup';
import { useNavigate } from 'react-router-dom';
import style from './Diagnoser.module.css';

const DiagnoserList = () => {
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const status = useSelector(state => state.Diagnoser.status);
    const statusUser = useSelector(state => state.LogIn.statusUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filter, setFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (status === "" || status === "faild") {
            dispatch(InitDiagnoser());
        }
    }, [status, dispatch]);

    const Delete = (d) => {
        dispatch(deleteDiagnoser(d));
        setConfirmDelete(null);
    };

    const getText = (s) => {
        let str = s.name + " " + s.mail;
        if (s.graphology) str += " גרפולוגיה";
        if (s.morphology) str += " מורפולוגיה";
        if (s.chirology) str += " כירולוגיה";
        return str;
    };

    const filtered = diagnosers?.filter((d) => {
        if (filter === "all") return true;
        if (filter === "available" && d.available) return true;
        if (filter === "Morfology" && d.morphology) return true;
        if (filter === "Chirology" && d.chirology) return true;
        if (filter === "Grafology" && d.graphology) return true;
        return false;
    });

    const final = filtered?.filter(s =>
        getText(s).toLowerCase().includes(search.toLowerCase())
    );

    if (status === "" || status === "loading") {
        return <div className={style.loading}>טוען נתונים...</div>;
    }

    if (status === "faild") {
        return <div className={style.error}>שגיאה בטעינה</div>;
    }

    return (
        <div className={style["diagnosticians-page"]}>

            {/* <h1 className={style.title}>רשימת מאבחנות</h1> */}

            {/* SEARCH */}
            <div className={style["search-row"]}>
                <input
                    className={style["search-input"]}
                    placeholder="חיפוש..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* FILTERS */}
            <div className={style["filters-row"]}>
                {["all", "available", "Morfology", "Chirology", "Grafology"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`${style["filter-btn"]} ${filter === f ? style.active : ""}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* CARDS */}
            <div className={style["cards-grid"]}>
                {final?.map((d) => (
                    <div key={d.mail} className={style.card}>

                        <h2 className={style.name}>{d.name}</h2>

                        <div className={style.capabilities}>
                            {d.morphology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                            {d.graphology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                            {d.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                        </div>

                        <p className={style.description}>{d.mail}</p>
                        <p className={style.description}>{d.phone}</p>

                        {/* STATUS */}
                        {d.available ? null : (
                            <div className={style.statusOff}>לא זמינה</div>
                        )}

                        <button
                            className={style["primary-btn1"]}
                            onClick={() => navigate(`/DiagnoserDetails/${d.code}`)}
                        >
                            פרטים נוספים
                        </button>

                        {statusUser === "Esty" && (
                            <button
                                className={style["primary-btn1"]}
                                onClick={() => setConfirmDelete(d)}
                            >
                                מחיקה
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* POPUP */}
            {confirmDelete && (
                <div className={style.modalBackdrop}>
                    <div className={style.modalBox}>
                        <p>למחוק את {confirmDelete.name}?</p>
                        <button onClick={() => Delete(confirmDelete)}>כן</button>
                        <button onClick={() => setConfirmDelete(null)}>לא</button>
                    </div>
                </div>
            )}
           {(statusUser === "Esty") &&<button
                className={style["primary-btn2"]}
                onClick={() => setOpen(true)}
            >
               ➕ הוספת מאבחנת
            </button>}


            {/* <AddDiagnosticianPopup
    isOpen={open}
    onClose={() => setOpen(false)}
    onSave={(data) => {
        dispatch(addDiagnoser(data)); // אם אתה רוצה כפול
    }}
/> */}

            <AddDiagnosticianPopup
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </div>
    );
};

export default DiagnoserList;