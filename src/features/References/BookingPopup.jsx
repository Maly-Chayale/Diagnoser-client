import React, { useEffect, useState } from 'react';
import './DiagnoserProfil.css';

const BookingPopup = ({ booking, customer, handleSave, handleCancel, setBooking }) => {

    // const [flag, setFlag] = useState(false)

    const getHour = (time) => {
        let hour = Math.floor(time)
        let minute = Math.round((time - hour) * 100)
        if (minute < 10)
            minute = "0" + minute
        if (hour < 10)
            hour = "0" + hour
        console.log("time: "+hour + ":" + minute);
        
        return hour + ":" + minute
        // return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;
    }

//     const getHour = (time) => {
//     let hour = Math.floor(time);
//     let minute = Math.round((time - hour) * 100);
//     if (hour < 10) hour = "0" + hour;
//     if (minute < 10) minute = "0" + minute;
//     return `${hour}:${minute}`; // תמיד במבנה "HH:MM"
// }

    // useEffect(()=>{
    //     setFlag(false)
    // }, [])

    // useEffect(()=> {
    //     if (!flag && booking)
    //         setFlag(true)
    // }, [booking])

    useEffect(() => {
        if (booking && typeof booking.time === 'number')
            setBooking({...booking, time: getHour(booking.time)})
    }, [booking])


    if (!booking) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>אישור סדנא {booking.codeWorkshop}</h3>
                <p>לקוח: {customer(booking.codeCustomer)?.name}</p>
                <p>מייל לקוח: {customer(booking.codeCustomer)?.mail}</p>

                <label>תאריך:</label>
                <input
                    type="date"
                    value={booking.date}
                    onChange={e => setBooking({ ...booking, date: e.target.value })}
                />

                <label>שעה:</label>
                <input
                    type="time"
                    value={booking.time}
                    onChange={e => setBooking({ ...booking, time: e.target.value })}
                />

                <label>כתובת:</label>
                <input
                    type="text"
                    value={booking.adress}
                    onChange={e => setBooking({ ...booking, adress: e.target.value })}
                />

                <label>הערות:</label>
                <input
                    type="text"
                    value={booking.comments}
                    onChange={e => setBooking({ ...booking, comments: e.target.value })}
                />

                <div className="button-container">
                    <button className="profile-button" onClick={handleSave}>אישור</button>
                    <button className="profile-button cancel-button" onClick={handleCancel}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default BookingPopup;