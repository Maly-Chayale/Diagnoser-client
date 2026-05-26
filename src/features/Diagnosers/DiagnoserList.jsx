import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiagnoser, InitDiagnoser, updateDiagnoser } from './DiagnoserSlice';
import AddDiagnosticianPopup from './AddDiagnosticianPopup';
import { useNavigate } from 'react-router-dom';
import style from './Diagnoser.module.css';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import DiagnoserWorkshopsModal from './DiagnoserWorkshopsModal';

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

    // NEW
    const [selectedDiagnoserWorkshops, setSelectedDiagnoserWorkshops] = useState(null);

    useEffect(() => {
        if (status === "" || status === "faild") {
            dispatch(InitDiagnoser());
        }
    }, [status, dispatch]);

    const Delete = (d) => {
        dispatch(deleteDiagnoser(d));
        setConfirmDelete(null);
    };

    const openWorkshopsModal = (diagnoser) => {
        setSelectedDiagnoserWorkshops(diagnoser);
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

            <div className={style["search-row"]}>
                <input
                    className={style["search-input"]}
                    placeholder="חיפוש..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

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

            <div className={style["cards-grid"]}>
                {final?.map((d) => (
                    <div key={d.mail} className={style.card}>

                        <h2 className={style.name}>
                            {highlight(d.name, search)}
                        </h2>

                        <div className={style.capabilities}>
                            {d.morphology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                            {d.graphology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                            {d.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                        </div>

                        <p className={style.description}>📧 {highlight(d.mail, search)}</p>
                        <p className={style.description}>📞 {highlight(d.phone, search)}</p>

                        {statusUser !== "Esty" && !d.available && (
                            <span className={style["status-off"]}>⛔ לא זמינה כרגע</span>
                        )}

                        {statusUser === "Esty" && (
                            <button
                                className={d.available ? style["status-on"] : style["status-off"]}
                                onClick={() => {
                                    const updatedDiagnoser = { ...d, available: !d.available };
                                    dispatch(updateDiagnoser(updatedDiagnoser));
                                }}
                            >
                                {d.available ? "✅ זמינה עכשיו" : "⛔ לא זמינה כרגע"}
                            </button>
                        )}

                        <button
                            className={style["primary-btn1"]}
                            onClick={() => navigate(`/DiagnoserDetails/${d.code}`)}
                        >
                            פרטים נוספים
                        </button>

                        {/* NEW BUTTON */}
                        <button
                            className={style["primary-btn1"]}
                            onClick={() => openWorkshopsModal(d)}
                        >
                            לצפיה בכל הסדנאות
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

            {confirmDelete && (
                <ConfirmDeletePopup
                    isOpen={!!confirmDelete}
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={() => Delete(confirmDelete)}
                    name={confirmDelete.name}
                />
            )}

            {statusUser === "Esty" && (
                <button
                    className={style["primary-btn2"]}
                    onClick={() => setOpen(true)}
                >
                    ➕ הוספת מאבחנת
                </button>
            )}

            <AddDiagnosticianPopup
                isOpen={open}
                onClose={() => setOpen(false)}
            />

            {/* NEW MODAL CALL */}
            {selectedDiagnoserWorkshops && (
                <DiagnoserWorkshopsModal
                    diagnoser={selectedDiagnoserWorkshops}
                    onClose={() => setSelectedDiagnoserWorkshops(null)}
                    onBooking={(workshop) => {
                        if (!statusUser || statusUser !== "Esty") {
                            // אפשר לשנות ללוגין שלך אם צריך
                            console.log("need login");
                            return;
                        }
                        console.log("booking:", workshop);
                    }}
                />
            )}

        </div>
    );
};

export default DiagnoserList;