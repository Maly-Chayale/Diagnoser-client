import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './WorkshopDiagnosersModal.module.css';
import OrderWorkshop from '../WorkShop/OrderWorkshop';
import LoginRequiredModal from '../AI/LoginRequiredModal';
import { useNavigate } from 'react-router-dom';


function DiagnoserWorkshopsModal({ diagnoser, onClose }) {

    const navigate = useNavigate();

    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const groups = useSelector(state => state.TypeGroup.groups);
    const user = useSelector(state => state.LogIn.thisUser);

    // NEW
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const getType = (code) =>
        groups.find(g => g.code === code)?.description;

    const filteredWorkshops = workshops?.filter(
        w => String(w.codeDiagnoser) === String(diagnoser.code)
    );

    return (
        <>
            <div className={style.modalBackdrop}>
                <div className={style.modalBox} style={{ "--items-count": filteredWorkshops.length }} >

                    {/* close */}
                    <button className={style.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    {/* title */}
                    <h3 className={style.modalTitle}>
                        סדנאות של {diagnoser.name}
                    </h3>

                    {/* list */}
                    <div className={style.diagnoserGrid}>

                        {filteredWorkshops?.length > 0 ? (
                            filteredWorkshops.map(w => (
                                <div key={w.code} className={style.diagnoserCard}>

                                    <h4>
                                        {getType(w.typeGroup)}
                                    </h4>
                                    <div className={style.capabilities}>
                                        {w?.morfology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                                        {w?.grafology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                                        {w?.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                                    </div>

                                    <div className={style.metaBox}>
                                        <span> {w.accontOfPeople} : משתתפים  👥  </span>
                                        <span> {w.price} : מחיר  💰  </span>

                                    </div>

                                    <p className={style.description}>
                                        {w.description}
                                    </p>

                                    {/* BOOKING BUTTON */}
                                    <button
                                        className={style.primaryBtn}
                                        onClick={() => {

                                            if (!user || !user.code) {
                                                setShowLoginModal(true);
                                                return;
                                            }

                                            setSelectedWorkshop(w);
                                        }}
                                    >
                                        הזמנה
                                    </button>

                                </div>
                            ))
                        ) : (
                            <p className={style.description}>
                                אין סדנאות למאבחנת זו
                            </p>
                        )}

                    </div>
                </div>
            </div>

            {/* ORDER WORKSHOP MODAL */}
            {selectedWorkshop && (
                <OrderWorkshop
                    WorkShop={selectedWorkshop}
                    diagnoser={diagnoser}
                    onClose={() => setSelectedWorkshop(null)}
                />
            )}

            {/* LOGIN REQUIRED */}
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

export default DiagnoserWorkshopsModal;