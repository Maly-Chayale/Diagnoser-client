import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { deleteWorkShop, InitWorkShops } from './WorkShopSlice';
import WorkshopDiagnosersModal from './WorkshopDiagnosersModal';
// import { addCustomer, InitCustomer } from '../Customers/CustomerSlice';
// import { addReference } from '../References/ReferencesSlice';
// import { deleteLead } from '../Leads/LeadsSlice';
import style from './AppointmentCard.module.css';
// import { sendEmail } from '../Email/EmailSlice';
// import { useNavigate } from 'react-router-dom';
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