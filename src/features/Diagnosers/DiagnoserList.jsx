import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiagnoser, InitDiagnoser } from './DiagnoserSlice';
import AddDiagnosticianPopup from './AddDiagnosticianPopup';
import { useNavigate } from 'react-router-dom';
import style from './Diagnoser.module.css';
import ConfirmDeletePopup from './ConfirmDeletePopup';

const DiagnoserList = () => {
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const status = useSelector(state => state.Diagnoser.status);
    const statusUser = useSelector(state => state.LogIn.statusUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filter, setFilter] = useState("הכל 🌐");
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

    const highlight = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className={style.highlight}>{part}</mark>
                : part
        );
    };

    const getText = (s) => {
        let str = s.name + " " + s.mail;
        if (s.graphology) str += " גרפולוגיה";
        if (s.morphology) str += " מורפולוגיה";
        if (s.chirology) str += " כירולוגיה";
        return str;
    };

    const filtered = diagnosers?.filter((d) => {
        if (filter === "הכל 🌐") return true;
        if (filter === "זמינות⚡" && d.available) return true;
        if (filter === "מורפולוגיה 🧠" && d.morphology) return true;
        if (filter === "כירולוגיה ✋" && d.chirology) return true;
        if (filter === "גרפולוגיה ✍️" && d.graphology) return true;
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
                {["הכל 🌐", "זמינות⚡", "מורפולוגיה 🧠", "כירולוגיה ✋", "גרפולוגיה ✍️"].map((f) => (
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

                        <h2 className={style.name}>
                            {highlight(d.name, search)}
                        </h2>
                        <div className={style.capabilities}>

                            {d.morphology && (
                                <span className={`${style.badge} ${style.morphology}`}>
                                    🧠 מורפולוגיה
                                </span>
                            )}

                            {d.graphology && (
                                <span className={`${style.badge} ${style.graphology}`}>
                                    ✍️ גרפולוגיה
                                </span>
                            )}

                            {d.chirology && (
                                <span className={`${style.badge} ${style.chirology}`}>
                                    ✋ כירולוגיה
                                </span>
                            )}

                        </div>




                        <p className={style.description}>
                            📧 {highlight(d.mail, search)}
                        </p>

                        <p className={style.description}>
                            📞 {highlight(d.phone, search)}
                        </p>

                        {/* only show when NOT available */}
                        {!d.available && (
                            <span className={style["status-off"]}>
                                ⛔ לא זמינה כרגע
                            </span>
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
            {/* 
            {
                final.length==0&&<p className="empty-text">לא נמצאו מאבחנות מתאימות לחיפוש.</p>
            } */}

            {/* POPUP */}
            {confirmDelete && (
                <ConfirmDeletePopup
                    isOpen={!!confirmDelete}
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={() => Delete(confirmDelete)}
                    name={confirmDelete.name}
                />
            )}
            {(statusUser === "Esty") && <button
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