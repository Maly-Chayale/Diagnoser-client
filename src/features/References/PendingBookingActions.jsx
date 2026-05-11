import React, { useState } from "react";
import axios from "axios";

export const PendingBookingActions = ({ booking, userEmail }) => {
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [alternatives, setAlternatives] = useState([]);

    const handleCancel = async () => {
        if (!window.confirm("האם אתה בטוח שאתה רוצה לבטל את הסדנא?")) return;

        // קריאה לשרת להבאת מאבחנות חלופיות
        const url = `https://localhost:7082/api/WorkShops/GetLDiagnosers/${booking.m}/${booking.g}/${booking.c}/${booking.typeGroup}`;
        const res = await axios.get(url);
        setAlternatives(res.data);
        setShowAlternatives(true);

        // שליחת מייל ללקוח (פונקציית C# תטפל בזה)
        await axios.post('https://localhost:7082/api/Mail/Send', {
            to: userEmail,
            subject: "ביטול סדנא",
            body: `הסדנא בוטלה. ניתן לבחור ממאבחנות חלופיות: ${res.data.map(d => d.name).join(", ")}`
        });
    }

    return (
        <div>
            <button className="profile-button cancel-button" onClick={handleCancel}>
                ביטול
            </button>
            {showAlternatives && (
                <div className="alternatives-popup">
                    <h4>מאבחנות חלופיות:</h4>
                    <ul>
                        {alternatives.map((a, i) => (
                            <li key={i}>{a.name} – משתתפים: {a.accontOfPeople}, תשלום: {a.price}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}