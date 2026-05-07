import React, { useState } from "react";
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

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // מידי עדכון – נבדוק תקינות השדה
        validateField(name, type === "checkbox" ? checked : value);
    };

    const validateField = (name, value) => {
        let err = "";

        if (["name", "mail", "password", "phone"].includes(name)) {
            if (!value) {
                err = "שדה חובה";
            } else {
                if (name === "mail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    err = "מייל לא תקין";
                }
            }
        }

        setErrors(prev => ({
            ...prev,
            [name]: err
        }));
    };

    const isStepValid = () => {
        if (step === 1) {
            return ["name", "mail", "password", "phone"].every(f => form[f] && !errors[f]);
        }
        if (step === 2) {
            return form.graphology || form.morphology || form.chirology;
        }
        return true;
    };

    const nextStep = () => {
        if (isStepValid()) setStep(2);
    };
    const nextToSummary = () => {
        if (isStepValid()) setStep(3);
    };
    const back = () => setStep(step - 1);

    const handleSubmit = () => {
        if (!isStepValid()) return;

        const payload = {
            ...form,
            available: true
        };

        dispatch(addDiagnoser(payload));
        // onSave?.(payload);
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
        setErrors({});
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.popup}>

                <button className={styles.closeBtn} onClick={closeAll}>×</button>

                <h2 className={styles.title}>הוספת מאבחנת</h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className={styles.step}>
                        <div className={styles.inputGroup}>
                            <input className={styles.input} name="name" placeholder="שם" value={form.name} onChange={handleChange} />
                            {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <input className={styles.input} name="mail" placeholder="מייל" value={form.mail} onChange={handleChange} />
                            {errors.mail && <span className={styles.error}>{errors.mail}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <input className={styles.input} name="password" type="password" placeholder="סיסמה" value={form.password} onChange={handleChange} />
                            {errors.password && <span className={styles.error}>{errors.password}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <input className={styles.input} name="phone" placeholder="טלפון" value={form.phone} onChange={handleChange} />
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>

                        <button
                            className={styles.wideBtn}
                            onClick={nextStep}
                            disabled={!isStepValid()}
                        >
                            המשך לבחירת תחומים
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className={styles.step}>
                        <p className={styles.subtitle}>בחרי תחומי התמחות</p>

                        <div className={styles.capGrid}>

                            <label className={`${styles.capCard} ${form.morphology ? styles.active : ""}`}>
                                <input type="checkbox" name="morphology" onChange={handleChange} />
                                🧠 מורפולוגיה
                            </label>

                            <label className={`${styles.capCard} ${form.graphology ? styles.active : ""}`}>
                                <input type="checkbox" name="graphology" onChange={handleChange} />
                                ✍️ גרפולוגיה
                            </label>

                            <label className={`${styles.capCard} ${form.chirology ? styles.active : ""}`}>
                                <input type="checkbox" name="chirology" onChange={handleChange} />
                                ✋ כירולוגיה
                            </label>

                        </div>
                        {!isStepValid() && <span className={styles.error}>בחר לפחות תחום אחד</span>}

                        <button className={styles.wideBtn} onClick={nextToSummary} disabled={!isStepValid()}>
                            המשך לסיכום
                        </button>

                        <button className={styles.backBtn} onClick={back}>
                            חזור
                        </button>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className={styles.step}>
                        <div className={styles.summary}>
                            <p><b>שם:</b> {form.name}</p>
                            <p><b>מייל:</b> {form.mail}</p>
                            <p><b>טלפון:</b> {form.phone}</p>

                            <p><b>תחומים:</b></p>
                            {form.morphology && <p>🧠 מורפולוגיה</p>}
                            {form.graphology && <p>✍️ גרפולוגיה</p>}
                            {form.chirology && <p>✋ כירולוגיה</p>}
                        </div>

                        <button className={styles.wideBtn} onClick={handleSubmit} disabled={!isStepValid()}>
                            שמור מאבחנת
                        </button>

                        <button className={styles.backBtn} onClick={back}>
                            חזור
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AddDiagnosticianPopup;