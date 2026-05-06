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

    const buildString = (s) => {
        let str = s.name + " " + s.mail;
        if (s.graphology) str += " גרפולוגיה";
        if (s.morphology) str += " מורפולוגיה";
        if (s.chirology) str += " כירולוגיה";
        return str;
    };

    const filtered = diagnosers?.filter((d) => {
        if (filter === "all") return true;
        if (filter === "available" && d.available) return true;
        if (filter === "Grafology" && d.graphology) return true;
        if (filter === "Morfology" && d.morphology) return true;
        if (filter === "Chirology" && d.chirology) return true;
        return false;
    });

    const final = filtered?.filter(s =>
        buildString(s).toLowerCase().includes(search.toLowerCase())
    );

    const highlight = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className={style.highlight}>{part}</mark>
                : part
        );
    };

    if (status === "" || status === "loading") {
        return (
            <div className={style["cards-grid"]}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={style["skeleton-card"]}></div>
                ))}
            </div>
        );
    }

    if (status === "faild") return <div>נכשל</div>;

    return (
        <div className={style["diagnosticians-page"]}>

            {/* <h1 className={style.title}>רשימת מאבחנות</h1> */}

            {/* SEARCH */}
            <div className={style["search-row"]}>
                <input
                    className={style["search-input"]}
                    placeholder="חיפוש מאבחנת..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* FILTERS */}
            <div className={style["filters-row"]}>

                <button className={`${style["filter-btn"]} ${filter === "all" ? style.active : ""}`} onClick={() => setFilter("all")}>🌐 הכל</button>

                <button className={`${style["filter-btn"]} ${filter === "available" ? style.active : ""}`} onClick={() => setFilter("available")}>⚡ זמינות</button>

                <button className={`${style["filter-btn"]} ${filter === "Grafology" ? style.active : ""}`} onClick={() => setFilter("Grafology")}>✍️ גרפולוגיה</button>

                <button className={`${style["filter-btn"]} ${filter === "Morfology" ? style.active : ""}`} onClick={() => setFilter("Morfology")}>🧠 מורפולוגיה</button>

                <button className={`${style["filter-btn"]} ${filter === "Chirology" ? style.active : ""}`} onClick={() => setFilter("Chirology")}>✋ כירולוגיה</button>

            </div>

            {/* EMPTY */}
            {final?.length === 0 && (
                <div className={style["empty-state"]}>
                    <div className={style["empty-icon"]}>🔍</div>
                    <h2>לא נמצאו תוצאות</h2>
                    <p>נסה לשנות חיפוש או פילטרים</p>
                </div>
            )}

            {/* GRID */}
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

            {/* DELETE */}
            {confirmDelete && (
                <div className={style["confirm-popup"]}>
                    <div className={style["confirm-content"]}>
                        <p>מחיקה של {confirmDelete.name}?</p>
                        <button onClick={() => Delete(confirmDelete)}>אישור</button>
                        <button onClick={() => setConfirmDelete(null)}>ביטול</button>
                    </div>
                </div>
            )}

            {/* ADD */}
            <button
                className={style["primary-btn2"]}
                onClick={() => setOpen(true)}
            >
               ➕ הוספת מאבחנת
            </button>
            <AddDiagnosticianPopup
                isOpen={open}
                onClose={() => setOpen(false)}
                onSave={() => { }}
            />
        </div>
    );
};

export default DiagnoserList;