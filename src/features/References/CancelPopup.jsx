import React from 'react';
import './CancelPopup.css';

const CancelPopup = ({ booking, customer, handleCancel, handleConfirm }) => {
    if (!booking) return null;

    const customerData = customer(booking.codeCustomer);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>ביטול סדנא {booking.codeWorkshop}</h3>
                <p>לקוח: {customerData?.name}</p>
                <p>מייל לקוח: {customerData?.mail}</p>
                <p>האם אתה בטוח שאתה רוצה לבטל את ההזמנה?</p>
                <div className="button-container">
                    <button className="profile-button cancel-button" onClick={handleCancel}>לא</button>
                    <button className="profile-button" onClick={handleConfirm}>כן, בטוח</button>
                </div>
            </div>
        </div>
    );
};

export default CancelPopup;