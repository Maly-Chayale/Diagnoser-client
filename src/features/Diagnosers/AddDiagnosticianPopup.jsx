import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addDiagnoser } from "./DiagnoserSlice";
import styles from "./AddDiagnosticianPopup.module.css";

function AddDiagnosticianPopup({ isOpen, onClose, onSave }) {
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        name: "",
        mail: "",
        password: "",
        phone: "",
        graphology: false,
        morphology: false,
        chirology: false
    });

    // 🔒 מניעת גלילה ברקע
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const nextStep = () => setStep(2);
    const nextToSummary = () => setStep(3);

    const back = () => {
        setStep(prev => Math.max(1, prev - 1));
    };

    const handleSubmit = () => {
        const payload = { ...form, available: true };

        dispatch(addDiagnoser(payload));
        onSave(payload);
        closeAll();
    };

    const closeAll = () => {
        setForm({
            name: "",
            mail: "",
            password: "",
            phone: "",
            graphology: false,
            morphology: false,
            chirology: false
        });

        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className={styles.backdrop}
            onClick={closeAll}
        >
            <div
                className={styles.popup}
                onClick={(e) => e.stopPropagation()} // ⭐ קריטי למניעת סגירה בזמן הקלדה
            >

                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={closeAll}
                >
                    ×
                </button>

                <h2 className={styles.title}>הוספת מאבחנת</h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className={styles.step}>
                        <input className={styles.input} name="name" placeholder="שם" onChange={handleChange} />

                        <input className={styles.input} name="mail" placeholder="מייל" onChange={handleChange} />

                        <input className={styles.input} name="password" type="password" placeholder="סיסמה" onChange={handleChange} />

                        <input className={styles.input} name="phone" placeholder="טלפון" onChange={handleChange} />

                        <button type="button" className={styles.primaryBtn} onClick={nextStep}>
                            המשך לבחירת תחומים
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className={styles.step}>
                        <p className={styles.subtitle}>בחרי תחומי התמחות</p>

                        <label>
                            <input
                                type="checkbox"
                                name="morphology"
                                checked={form.morphology}
                                onChange={handleChange}
                            />
                            מורפולוגיה
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="graphology"
                                checked={form.graphology}
                                onChange={handleChange}
                            />
                            גרפולוגיה
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="chirology"
                                checked={form.chirology}
                                onChange={handleChange}
                            />
                            כירולוגיה
                        </label>

                        <button type="button" className={styles.primaryBtn} onClick={nextToSummary}>
                            המשך לסיכום
                        </button>

                        <button type="button" className={styles.secondaryBtn} onClick={back}>
                            חזור
                        </button>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className={styles.step}>
                        <p><b>שם:</b> {form.name}</p>
                        <p><b>מייל:</b> {form.mail}</p>
                        <p><b>טלפון:</b> {form.phone}</p>

                        <p><b>תחומים:</b></p>
                        {form.morphology && <p>מורפולוגיה</p>}
                        {form.graphology && <p>גרפולוגיה</p>}
                        {form.chirology && <p>כירולוגיה</p>}

                        <button type="button" className={styles.primaryBtn} onClick={handleSubmit}>
                            שמור מאבחנת
                        </button>

                        <button type="button" className={styles.secondaryBtn} onClick={back}>
                            חזור
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AddDiagnosticianPopup;