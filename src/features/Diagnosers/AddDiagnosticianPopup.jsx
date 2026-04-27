import React, { useState } from "react"
import "./Diagnoser.css";
import { useDispatch } from "react-redux";
import { addDiagnoser } from "./DiagnoserSlice";


function AddDiagnosticianPopup({ isOpen, onClose, onSave }) {

    const dispatch = useDispatch()
    const [form, setForm] = useState({ name: "", mail: "", password: "", phone: "", graphology: "", morphology: "", chirology:"" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.graphology = form.graphology ? true : false
        form.morphology = form.morphology ? true : false
        form.chirology = form.chirology ? true : false
        form.available = true;
        onSave(form);
        dispatch(addDiagnoser(form))
        Close();
    };

    const Close = () => {
        setForm({ name: "", mail: "", password: "", graphology: "", morphology: "",chirology:"" })
        onClose()
    }

    if (!isOpen)
        return null;

    return (
        <div style={backdropStyle}>
            <div style={popupStyle}>
                <h2>הוספת מאבחנת חדשה</h2>
                <form onSubmit={handleSubmit}>
                    <div style={fieldStyle}>
                        <label>שם</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div style={fieldStyle}>
                        <label>אימייל</label>
                        <input type="email" name="mail" value={form.mail} onChange={handleChange} required />
                    </div>
                    <div style={fieldStyle}>
                        <label>סיסמה</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div style={fieldStyle}>
                        <label>פלאפון</label>
                        <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <p>סמני את תחומי העיסוק של המאבחנת</p>
                    <label>
                        <input type="checkbox" name="morphology" onChange={handleChange} />
                        מורפולוגית
                    </label>
                    <br></br>
                    <label>
                        <input type="checkbox" name="chirology" onChange={handleChange} />
                        כירולוגית
                    </label>
                    <br></br>
                    <label>
                        <input type="checkbox" name="graphology" onChange={handleChange} />
                        גרפולוגית
                    </label>
                    <div style={buttonsRow}>
                        <button type="button" onClick={Close}> ביטול </button>
                        <button type="submit">שמור</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1000,
};

const popupStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    direction: "rtl",
};

const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    gap: "4px",
};
const buttonsRow = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "16px",
};

export default AddDiagnosticianPopup;  