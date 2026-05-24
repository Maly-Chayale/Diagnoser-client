import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWorkShop, InitWorkShops } from './WorkShopSlice';
import WorkshopDiagnosersModal from './WorkshopDiagnosersModal';
import { addCustomer, InitCustomer } from '../Customers/CustomerSlice';
import { addReference } from '../References/ReferencesSlice';
import { deleteLead } from '../Leads/LeadsSlice';
import style from './AppointmentCard.module.css';
import { sendEmail } from '../Email/EmailSlice';
import { useNavigate } from 'react-router-dom';
import OrderWorkshop from './OrderWorkshop'

function WorkshopCard({ WorkShop }) {

    const dispatch = useDispatch();
    // const navigate = useNavigate()

    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedDiagnoser, setSelectedDiagnoser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingDiagnoser, setBookingDiagnoser] = useState(null);
    // const [bookingData, setBookingData] = useState({
    //     date: "",
    //     time: "",
    //     adress: ""
    // });

    const groups = useSelector(state => state.TypeGroup.groups);
    // const diagnosers = useSelector(state => state.WorkShop.Diagnosers);
    // const workshops = useSelector(state => state.WorkShop.WorkShops);
    // const customer = useSelector(state => state.LogIn.thisUser);
    // const statusUser = useSelector(state => state.LogIn.statusUser);
    // const customers = useSelector(state => state.Customer.Customers);
    // const statusCust = useSelector(state => state.Customer.status);

    // useEffect(() => {
    //     if (statusCust === "") {
    //         dispatch(InitCustomer());
    //     }
    // }, [dispatch, statusCust]);

    const getType = (code) => {
        return groups.find(g => g.code === code)?.description;
    };

    // const openModal = async () => {
    //     setIsModalOpen(true);
    //     await dispatch(GetDiagnosersOfThisWorkshop(WorkShop));
    // };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedDiagnoser(null);
    // };

    // const openDeleteModal = () => {
    //     setIsDeleteModalOpen(true);
    // };

    // const closeDeleteModal = () => {
    //     setIsDeleteModalOpen(false);
    // };

    // const handleDelete = async () => {
    //     await dispatch(deleteWorkShop(WorkShop));
    //     await dispatch(InitWorkShops());
    //     closeDeleteModal();
    // };

    // const getWorkshop = (diagnoser) => {
    //     return workshops.find(w =>
    //         w.codeDiagnoser === diagnoser.code &&
    //         w.morfology === WorkShop.morfology &&
    //         w.chirology === WorkShop.chirology &&
    //         w.grafology === WorkShop.grafology &&
    //         w.typeGroup === WorkShop.typeGroup
    //     )
    // }

    // const openBookingModal = (diagnoser) => {
    //     setBookingDiagnoser(diagnoser);
    //     setBookingData({
    //         date: "",
    //         time: "",
    //         adress: ""
    //     });
    //     setIsBookingModalOpen(true);
    // };

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

            {/* MODAL */}
{/* 
            {isModalOpen && (
                <div className={style.modalBackdrop}>

                    <div className={style.modalBox}>

                        <button
                            className={style.closeBtn}
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h4 className={style.modalTitle}>

                            {WorkShop?.morfology && (
                                <span className={`${style.badge} ${style.morphology}`}>
                                    🧠 מורפולוגיה
                                </span>
                            )}

                            {WorkShop?.grafology && (
                                <span className={`${style.badge} ${style.graphology}`}>
                                    ✍️ גרפולוגיה
                                </span>
                            )}

                            {WorkShop?.chirology && (
                                <span className={`${style.badge} ${style.chirology}`}>
                                    ✋ כירולוגיה
                                </span>
                            )}
                        </h4>

                        <h3 className={style.modalTitle}>
                            מאבחנות זמינות
                        </h3>

                        <div className={style.diagnoserGrid}>

                            {diagnosers?.filter(d => d.available).map((diagnoser) => (

                                <div
                                    key={diagnoser.code}
                                    className={style.diagnoserCard}
                                >
                                    <div className={style.metaBox}>
                                        <span>
                                            {getWorkshop(diagnoser)?.accontOfPeople} : משתתפים    👥
                                        </span><br />

                                        <span>
                                            {getWorkshop(diagnoser)?.price}  : מחיר  💰
                                        </span>

                                    </div>

                                    <h4>{diagnoser.name}</h4>

                                    <p>{diagnoser.mail}</p>

                                    <div className={style.modalButtons}>

                                        <button
                                            className={style.primaryBtn}
                                            // onClick={() => handleBooking(diagnoser)}
                                            onClick={() => openBookingModal(diagnoser)}
                                        >
                                            הזמנה
                                        </button>

                                        <button
                                            className={style.secondaryBtn}
                                            onClick={() => setSelectedDiagnoser(diagnoser)}
                                        >
                                            פרטים
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>

                        {selectedDiagnoser && (

                            <div className={style.detailsBox}>

                                <h3>פרטי המאבחנת</h3>

                                <div className={style.detailsContent}>

                                    <p>
                                        <strong>שם:</strong>
                                        {" "}
                                        {selectedDiagnoser.name}
                                    </p>

                                    <p>
                                        <strong>מייל:</strong>
                                        {" "}
                                        {selectedDiagnoser.mail}
                                    </p>

                                    <p>
                                        <strong>טלפון:</strong>
                                        {" "}
                                        {selectedDiagnoser.phone}
                                    </p>

                                    <p>
                                        <strong>תיאור:</strong>
                                        {" "}
                                        {selectedDiagnoser.description}
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

            {isBookingModalOpen && (

                <div className={style.modalBackdrop}>

                    <div className={style.modalBox}>

                        <h3>פרטי הזמנה</h3>

                        <input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) =>
                                setBookingData({
                                    ...bookingData,
                                    date: e.target.value
                                })
                            }
                        />

                        <input
                            type="time"
                            value={bookingData.time}
                            onChange={(e) =>
                                setBookingData({
                                    ...bookingData,
                                    time: e.target.value
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="מיקום"
                            value={bookingData.adress}
                            onChange={(e) =>
                                setBookingData({
                                    ...bookingData,
                                    adress: e.target.value
                                })
                            }
                        />

                        <div className={style.modalButtons}>

                            <button
                                className={style.confirmBtn}
                                onClick={handleBooking}
                            >
                                אישור הזמנה
                            </button>

                            <button
                                className={style.cancelBtn}
                                onClick={() => setIsBookingModalOpen(false)}
                            >
                                ביטול
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {isDeleteModalOpen && (

                <div className={style.modalBackdrop}>

                    <div className={style.deleteModal}>

                        <h3>
                            האם למחוק את הסדנא?
                        </h3>

                        <div className={style.modalButtons}>

                            <button
                                className={style.confirmBtn}
                                onClick={handleDelete}
                            >
                                אישור
                            </button>

                            <button
                                className={style.cancelBtn}
                                onClick={closeDeleteModal}
                            >
                                ביטול
                            </button>

                        </div>

                    </div>

                </div>
            )} */}

            {isModalOpen && (
                <WorkshopDiagnosersModal
                    WorkShop={WorkShop}
                    onClose={() => setIsModalOpen(false)}
                    onBooking={(diagnoser) => setBookingDiagnoser(diagnoser)}
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
        </>
    );
}

export default WorkshopCard;