import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './AppointmentCard.module.css';
import WorkshopDiagnosersModal from './WorkshopDiagnosersModal';
import OrderWorkshop from './OrderWorkshop';

function WorkshopCard({ WorkShop }) {
    const dispatch = useDispatch();
    const groups = useSelector(state => state.TypeGroup.groups);

    const [isDiagnosersModalOpen, setIsDiagnosersModalOpen] = useState(false);
    const [bookingDiagnoser, setBookingDiagnoser] = useState(null);
    

    const getType = (code) => groups.find(g => g.code === code)?.description;

    return (
        <>
            <div className={style.card}>
                <h2 className={style.title}>{getType(WorkShop.typeGroup)}</h2>
                <div className={style.capabilities}>
                    {WorkShop?.morfology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                    {WorkShop?.grafology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                    {WorkShop?.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                </div>
                <p className={style.description}>{WorkShop?.description}</p>

                <button className={style.primaryBtn} onClick={() => setIsDiagnosersModalOpen(true)}>
                    לצפייה בפרופיל ותורים
                </button>
            </div>

            {/* מודאל מאבחנות */}
            {isDiagnosersModalOpen && (
                <WorkshopDiagnosersModal
                    WorkShop={WorkShop}
                    onClose={() => setIsDiagnosersModalOpen(false)}
                    onBooking={(diagnoser) => setBookingDiagnoser(diagnoser)}
                />
            )}

            {/* מודאל הזמנה */}
            {bookingDiagnoser && (
                <OrderWorkshop
                    diagnoser={bookingDiagnoser}
                    onClose={() => setBookingDiagnoser(null)}
                />
            )}
        </>
    );
}

export default WorkshopCard;