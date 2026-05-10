import React from 'react';
import style from './Diagnoser.module.css';

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, name }) => {
    if (!isOpen) return null;

    return (
        <div className={style.modalBackdrop}>
            <div className={style.modalBox}>
                <div className={style.modalIcon}>⚠️</div>
                <h3>מחיקה</h3>
                <p>למחוק את <strong>{name}</strong>?</p>
                <div className={style.modalButtons}>
                    <button className={style.confirmBtn} onClick={onConfirm}>
                        כן, מחק
                    </button>
                    <button className={style.cancelBtn} onClick={onClose}>
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeletePopup;