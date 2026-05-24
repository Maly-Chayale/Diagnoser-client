import React, { useState } from 'react';
import HebrewDatePicker from '../Calendar/HebrewDatePicker';
import style from './OrderWorksop.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer } from '../Customers/CustomerSlice';
import { deleteLead } from '../Leads/LeadsSlice';
import { addReference } from '../References/ReferencesSlice';
import { sendEmail } from '../Email/EmailSlice';

function OrderWorkshop({ WorkShop, diagnoser, onClose }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const customer = useSelector(state => state.LogIn.thisUser);
    const customers = useSelector(state => state.Customer.Customers);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState({ date: null, time: "", adress: "" });
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleBooking = async () => {
        if (!bookingData.date || !bookingData.time || !bookingData.adress) {
            alert("יש למלא את כל השדות");
            return;
        }
        try {
            const existingCustomer = customers.find(c => c.code === customer.code);
            if (!existingCustomer) {
                await dispatch(deleteLead(customer)).unwrap();
                const c = await dispatch(addCustomer(customer)).unwrap();
                customer.code = c
            }
            const newReference = {
                code: 0,
                codeWorkShop: workshops.find(w =>
                    w.morfology === WorkShop.morfology &&
                    w.chirology === WorkShop.chirology &&
                    w.grafology === WorkShop.grafology &&
                    w.typeGroup === WorkShop.typeGroup
                )?.code,
                codeCustomer: customer.code,
                date: bookingData.date.iso,
                time: parseInt(bookingData.time.substring(0, 2)) +
                    (parseInt(bookingData.time.substring(3, 5)) * 1.0 / 100),
                adress: bookingData.adress,
                comments: "",
                status: 1
            };
            await dispatch(addReference(newReference)).unwrap();
            setIsBookingModalOpen(false);
            navigate(`/OrderOfCusatomer/${newReference.codeCustomer}`);
            const mailBody = `שלום ${diagnoser.name},
                    יש הזמנה חדשה לסדנא.
                    תאריך: ${bookingData.date.iso}
                    שעה: ${bookingData.time}
                    מיקום: ${bookingData.adress}`;
            const mailSubject = `הזמנה לסדנא ${WorkShop.code}`;
            dispatch(sendEmail({
                toEmail: diagnoser.mail,
                subject: mailSubject,
                body: mailBody
            }));
        }
        catch (error) {
            console.error("שגיאה בהזמנה:", error);
            alert("אירעה שגיאה בהזמנה, נסי שוב.");
        }
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