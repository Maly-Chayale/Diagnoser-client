import React from 'react';
import styles from './BookingPopupDetails.module.css';

const BookingPopupDetails = ({ booking, customer, getDiagnoser, handleCancel }) => {

  const getHour = (time) => {
    let hour = Math.floor(time);
    let minute = Math.round((time - hour) * 100);
    if (minute < 10) minute = "0" + minute;
    if (hour < 10) hour = "0" + hour;
    return hour + ":" + minute;
  };

  if (!booking) return null;

  return (
    <div className={styles.overlay} >
      <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleCancel}>×</button>
        <h3 className={styles.title}>פרטי הזמנה</h3>

        <div className={styles.field}>
          <label className={styles.labelBlue}>תאריך</label>
          <input type="date" value={booking.date} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>שעה</label>
          <input type="text" value={booking.time} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>לקוח</label>
          <input type="text" value={customer(booking.codeCustomer)?.name} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>מייל לקוח</label>
          <input type="text" value={customer(booking.codeCustomer)?.mail} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>סדנא</label>
          <input type="text" value={booking.codeWorkshop} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>מאבחנת</label>
          <input type="text" value={getDiagnoser(booking.codeWorkshop)?.name} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>מייל מאבחנת</label>
          <input type="text" value={getDiagnoser(booking.codeWorkshop)?.mail} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>כתובת</label>
          <input type="text" value={booking.adress} readOnly className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.labelBlue}>הערות</label>
          <input type="text" value={booking.comments} readOnly className={styles.input} />
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleCancel}>סגור</button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopupDetails;