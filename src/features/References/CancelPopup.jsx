import React from 'react';
import styles from './CancelPopup.module.css';

const CancelPopup = ({ booking, customer, handleCancel, handleConfirm }) => {
    
    if (!booking) return null;

    const customerData = customer(booking.codeCustomer);

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <h3>ביטול סדנא {booking.codeWorkshop}</h3>
                <p>לקוח: {customerData?.name}</p>
                <p>מייל לקוח: {customerData?.mail}</p>
                <p>האם אתה בטוח שאתה רוצה לבטל את ההזמנה?</p>
                <div className={styles.buttonContainer}>
                    <button className={`${styles.profileButton} ${styles.cancelButton}`} onClick={handleCancel}>לא</button>
                    <button className={styles.profileButton} onClick={handleConfirm}>כן, בטוח</button>
                </div>
            </div>
        </div>
    );
};

export default CancelPopup;