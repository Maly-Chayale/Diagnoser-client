import React, { useState } from 'react';
import HebrewDatePicker from '../Calendar/HebrewDatePicker';
import style from './OrderWorksop.module.css';

function OrderWorkshop({ diagnoser, onClose }) {
    const [bookingData, setBookingData] = useState({ date: null, time: "", adress: "" });
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleBooking = () => {
        if (!bookingData.date || !bookingData.time || !bookingData.adress) {
            alert("יש למלא את כל השדות");
            return;
        }
        console.log("Booking for:", diagnoser, "Data:", bookingData);
        onClose();
    };

    return (
        <div className={style.modalBackdrop}>
            <div className={style.modalBox}>
                <button className={style.closeBtn} onClick={onClose}>✕</button>
                <h3>הזמנת סדנה עם {diagnoser.name}</h3>

                {/* כפתור בחירת תאריך / כפתור סגירה */}
                {calendarOpen ? (
                    <button
                        className={style.closeCalendarBtn}
                        onClick={() => setCalendarOpen(false)}
                    >
                        ❌ סגור לוח שנה
                    </button>
                ) : (
                    <button
                        className={style.datePickerBtn}
                        onClick={() => setCalendarOpen(true)}
                    >
                        📅 {bookingData.date ? `${bookingData.date.heb} (${bookingData.date.greg})` : "בחר תאריך"}
                    </button>
                )}

                {/* לוח השנה */}
                {calendarOpen && (
                    <HebrewDatePicker
                        value={bookingData.date}
                        onChange={(date) => {
                            setBookingData({ ...bookingData, date });
                            setCalendarOpen(false);
                        }}
                    />
                )}

                {/* זמן */}
                <input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                />

                {/* מיקום */}
                <input
                    type="text"
                    placeholder="הכנס את המיקום בו ברצונך לקיים את הסדנה"
                    value={bookingData.adress}
                    onChange={(e) => setBookingData({ ...bookingData, adress: e.target.value })}
                />

                {/* כפתורי פעולה */}
                <div className={style.modalButtons}>
                    <button className={style.confirmBtn} onClick={handleBooking}>אשר</button>
                    <button className={style.cancelBtn} onClick={onClose}>ביטול</button>
                </div>
            </div>
        </div>
    );
}

export default OrderWorkshop;