import React, { useEffect } from 'react';
import styles from './BookingPopupOk.module.css';

const BookingPopupOk = ({ booking, customer, handleSave, handleCancel, setBooking }) => {

    const getHour = (time) => {
        let hour = Math.floor(time)
        let minute = Math.round((time - hour) * 100)
        if (minute < 10)
            minute = "0" + minute
        if (hour < 10)
            hour = "0" + hour
        return hour + ":" + minute
    }

    useEffect(() => {
        if (booking && typeof booking.time === 'number')
            setBooking({...booking, time: getHour(booking.time)})
    }, [booking])

    if (!booking) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <h3 className={styles.title}>אישור סדנא {booking.codeWorkshop}</h3>
                <p>לקוח: {customer(booking.codeCustomer)?.name}</p>
                <p>מייל לקוח: {customer(booking.codeCustomer)?.mail}</p>

                <label className={styles.label}>תאריך:</label>
                <input
                    type="date"
                    className={styles.input}
                    value={booking.date}
                    onChange={e => setBooking({ ...booking, date: e.target.value })}
                />

                <label className={styles.label}>שעה:</label>
                <input
                    type="time"
                    className={styles.input}
                    value={booking.time}
                    onChange={e => setBooking({ ...booking, time: e.target.value })}
                />

                <label className={styles.label}>כתובת:</label>
                <input
                    type="text"
                    className={styles.input}
                    value={booking.adress}
                    onChange={e => setBooking({ ...booking, adress: e.target.value })}
                />

                <label className={styles.label}>הערות:</label>
                <input
                    type="text"
                    className={styles.input}
                    value={booking.comments}
                    onChange={e => setBooking({ ...booking, comments: e.target.value })}
                />

                <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={handleSave}>אישור</button>
                    <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default BookingPopupOk;