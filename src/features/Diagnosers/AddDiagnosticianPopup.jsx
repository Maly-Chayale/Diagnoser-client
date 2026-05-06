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

    const validateStep1 = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "שם חובה";

        if (!form.mail.trim()) {
            newErrors.mail = "אימייל חובה";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) {
            newErrors.mail = "אימייל לא תקין";
        }

        if (!form.password || form.password.length < 4) {
            newErrors.password = "סיסמה חייבת להיות לפחות 4 תווים";
        }

        if (!form.phone.trim()) newErrors.phone = "טלפון חובה";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const nextStep = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            available: true
        };

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
        setErrors({});
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.popup}>

                <h2 className={styles.title}>הוספת מאבחנת</h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className={styles.step}>
                        <input
                            className={styles.input}
                            name="name"
                            placeholder="שם מלא"
                            value={form.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}

                        <input
                            className={styles.input}
                            name="mail"
                            placeholder="אימייל"
                            value={form.mail}
                            onChange={handleChange}
                        />
                        {errors.mail && <span className={styles.error}>{errors.mail}</span>}

                        <input
                            className={styles.input}
                            name="password"
                            type="password"
                            placeholder="סיסמה"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className={styles.error}>{errors.password}</span>}

                        <input
                            className={styles.input}
                            name="phone"
                            placeholder="טלפון"
                            value={form.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <span className={styles.error}>{errors.phone}</span>}

                        <button className={styles.nextBtn} onClick={nextStep}>
                            המשך לבחירת תחומים
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className={styles.step}>
                        <p className={styles.subtitle}>
                            בחרי תחום/ים שבהם את מתמחה
                        </p>

                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="morphology"
                                checked={form.morphology}
                                onChange={handleChange}
                            />
                            מורפולוגיה
                        </label>

                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="chirology"
                                checked={form.chirology}
                                onChange={handleChange}
                            />
                            כירולוגיה
                        </label>

                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="graphology"
                                checked={form.graphology}
                                onChange={handleChange}
                            />
                            גרפולוגיה
                        </label>

                        <div className={styles.buttons}>
                            <button className={styles.secondaryBtn} onClick={() => setStep(1)}>
                                חזור
                            </button>

                            <button className={styles.primaryBtn} onClick={handleSubmit}>
                                שמור
                            </button>
                        </div>
                    </div>
                )}

                <button className={styles.closeBtn} onClick={closeAll}>×</button>
            </div>
        </div>
    );
}

export default AddDiagnosticianPopup;