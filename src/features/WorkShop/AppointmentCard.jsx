import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteWorkShop,
    InitWorkShops
} from './WorkShopSlice';
import {
    addCustomer,
    InitCustomer
} from '../Customers/CustomerSlice';
import { addReference } from '../References/ReferencesSlice';
import { deleteLead } from '../Leads/LeadsSlice';
import { sendEmail } from '../Email/EmailSlice';
import style from './AppointmentCard.module.css';
import WorkshopDiagnosersModal from './WorkshopDiagnosersModal';

function WorkshopCard({ WorkShop }) {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingDiagnoser, setBookingDiagnoser] = useState(null);
    const [bookingData, setBookingData] = useState({ date: "", time: "", adress: "" });

    const groups = useSelector(state => state.TypeGroup.groups);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const customer = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const customers = useSelector(state => state.Customer.Customers);
    const statusCust = useSelector(state => state.Customer.status);

    useEffect(() => {
        if (statusCust === "") dispatch(InitCustomer());
    }, [dispatch, statusCust]);

    const getType = (code) => groups.find(g => g.code === code)?.description;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleDelete = async () => {
        await dispatch(deleteWorkShop(WorkShop));
        await dispatch(InitWorkShops());
        closeDeleteModal();
    };

    const openBookingModal = (diagnoser) => {
        setBookingDiagnoser(diagnoser);
        setBookingData({ date: "", time: "", adress: "" });
        setIsBookingModalOpen(true);
    };

    const handleBooking = async () => {
        if (!bookingData.date || !bookingData.time || !bookingData.adress) {
            alert("יש למלא את כל השדות");
            return;
        }

        try {
            const existingCustomer = customers.find(c => c.code === customer.code);
            if (!existingCustomer) {
                await dispatch(deleteLead(customer)).unwrap();
                await dispatch(addCustomer(customer)).unwrap();
            }

            const newReference = {
                code: 0,
                codeWorkShop: workshops.find(w =>
                    w.codeDiagnoser === bookingDiagnoser.code &&
                    w.morfology === WorkShop.morfology &&
                    w.chirology === WorkShop.chirology &&
                    w.grafology === WorkShop.grafology &&
                    w.typeGroup === WorkShop.typeGroup
                )?.code,
                codeCustomer: customer.code,
                date: bookingData.date,
                time: parseInt(bookingData.time.substring(0, 2)) +
                      parseInt(bookingData.time.substring(3, 5)) / 100,
                adress: bookingData.adress,
                comments: "",
                status: 1
            };

            await dispatch(addReference(newReference)).unwrap();
            setIsBookingModalOpen(false);

            const mailBody = `שלום ${bookingDiagnoser.name},\n\nיש הזמנה חדשה לסדנא.\nתאריך: ${bookingData.date}\nשעה: ${bookingData.time}\nמיקום: ${bookingData.adress}`;
            const mailSubject = `הזמנה לסדנא ${WorkShop.code}`;

            dispatch(sendEmail({ toEmail: bookingDiagnoser.mail, subject: mailSubject, body: mailBody }));

        } catch (error) {
            console.error("שגיאה בהזמנה:", error);
            alert("אירעה שגיאה בהזמנה, נסי שוב.");
        }
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

                <button className={style.primaryBtn} onClick={openModal}>לצפייה בפרופיל ותורים</button>

                {statusUser === "Esty" && <button className={style.deleteBtn} onClick={openDeleteModal}>מחיקה</button>}
            </div>

            {/* מודאל המאבחנות */}
            {/* מודאל המאבחנות */}
{isModalOpen && (
    <WorkshopDiagnosersModal
        WorkShop={WorkShop}
        onClose={closeModal}
        onBooking={openBookingModal}
    />
)}

{/* מודאל הזמנה */}
{isBookingModalOpen && (
    <div className={style.modalBackdrop}>
        <div className={style.modalBox}>

            <h3>פרטי הזמנה</h3>

            <input
                type="date"
                value={bookingData.date}
                onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                }
            />

            <input
                type="time"
                value={bookingData.time}
                onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                }
            />

            <input
                type="text"
                placeholder="מיקום"
                value={bookingData.adress}
                onChange={(e) =>
                    setBookingData({ ...bookingData, adress: e.target.value })
                }
            />

            <div className={style.modalButtons}>
                <button className={style.confirmBtn} onClick={handleBooking}>
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

{/* מודאל מחיקה */}
{isDeleteModalOpen && (
    <div className={style.modalBackdrop}>
        <div className={style.deleteModal}>

            <h3>האם למחוק את הסדנא?</h3>

            <div className={style.modalButtons}>
                <button className={style.confirmBtn} onClick={handleDelete}>
                    אישור
                </button>

                <button className={style.cancelBtn} onClick={closeDeleteModal}>
                    ביטול
                </button>
            </div>

        </div>
    </div>
)}

</>
);
}

export default WorkshopCard;