import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BookingPopupDetails.css';

const BookingPopupDetails = ({ booking, customer, getDiagnoser, handleCancel }) => {
    return (
        <AnimatePresence>
            {booking && (
                <motion.div
                    className="popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCancel}
                >
                    <motion.div
                        className="popup-content"
                        initial={{ scale: 0.5, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3>פרטי הזמנה</h3>
                        <p>תאריך: {booking.date}</p>
                        <p>שעה: {booking.time}</p>
                        <p>לקוח: {customer(booking.codeCustomer)?.name}</p>
                        <p>מייל לקוח: {customer(booking.codeCustomer)?.mail}</p>
                        <p>מאבחנת: {getDiagnoser(booking.codeWorkshop)?.name}</p>
                        <p>מייל מאבחנת: {getDiagnoser(booking.codeWorkshop)?.mail}</p>
                        <p>סדנא: {booking.codeWorkshop}</p>
                        <p>כתובת: {booking.adress}</p>
                        <p>הערות: {booking.comments}</p>
                        <button onClick={handleCancel}>סגור</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookingPopupDetails;