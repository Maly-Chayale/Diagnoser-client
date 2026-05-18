import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BookingPopupDetails.module.css';

const BookingPopupDetails = ({ booking, customer, getDiagnoser, handleCancel }) => {

  const getHour = (time) => {
    let hour = Math.floor(time)
    let minute = Math.round((time - hour) * 100)
    if (minute < 10)
      minute = "0" + minute
    if (hour < 10)
      hour = "0" + hour
    return hour + ":" + minute
  }

  return (
    <AnimatePresence>
      {booking && (
        <motion.div
          className={styles.popupOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <motion.div
            className={styles.popupOverlay}
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className={styles.title}>פרטי הזמנה</h3>

            <div className={styles.field}>
              <label>תאריך</label>
              <input type="date" value={booking.date} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>שעה</label>
              <input type="text" value={booking.time} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>לקוח</label>
              <input type="text" value={customer(booking.codeCustomer)?.name} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>מייל לקוח</label>
              <input type="text" value={customer(booking.codeCustomer)?.mail} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>סדנא</label>
              <input type="text" value={booking.codeWorkshop} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>מאבחנת</label>
              <input type="text" value={getDiagnoser(booking.codeWorkshop)?.name} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>מייל מאבחנת</label>
              <input type="text" value={getDiagnoser(booking.codeWorkshop)?.mail} readOnly className={styles.input} />
            </div>

            <div className={styles.field}>
              <label>הערות</label>
              <input type="text" value={booking.comments} readOnly className={styles.input} />
            </div>

            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleCancel}>סגור</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingPopupDetails;