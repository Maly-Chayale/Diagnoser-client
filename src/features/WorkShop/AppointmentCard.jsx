import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WorkshopDiagnosersModal from './WorkshopDiagnosersModal';
import style from './AppointmentCard.module.css';
import { useNavigate } from 'react-router-dom';
import OrderWorkshop from './OrderWorkshop'
import LoginRequiredModal from '../AI/LoginRequiredModal';

function WorkshopCard({ WorkShop }) {

    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingDiagnoser, setBookingDiagnoser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const user = useSelector(state => state.LogIn.thisUser);
    const groups = useSelector(state => state.TypeGroup.groups);

    const getType = (code) => {
        return groups.find(g => g.code === code)?.description;
    };

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

                <button className={style.primaryBtn} onClick={() => setIsModalOpen(true)}>
                    לצפייה בפרופיל ותורים
                </button>
            </div>

            {isModalOpen && (
                <WorkshopDiagnosersModal
                    WorkShop={WorkShop}
                    onClose={() => setIsModalOpen(false)}
                    onBooking={(diagnoser) => {
                        if (!user || !user.code) {
                            setShowLoginModal(true);
                            return;
                        }
                        setBookingDiagnoser(diagnoser);
                    }}
                />
            )}

            {/* מודאל הזמנה */}
            {bookingDiagnoser && (
                <OrderWorkshop
                    WorkShop={WorkShop}
                    diagnoser={bookingDiagnoser}
                    onClose={() => setBookingDiagnoser(null)}
                />
            )}

            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={() => {
                        setShowLoginModal(false);
                        navigate("/login");
                    }}
                />
            )}
        </>
    );
}

export default WorkshopCard;