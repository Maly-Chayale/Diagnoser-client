import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, closeOrder, deleteReference, InitReferences, updateReference } from './ReferencesSlice';
import { GetDiagnosersOfThisWorkshop, InitWorkShops } from '../WorkShop/WorkShopSlice';
import { fetchStatus } from '../Statuss/StatusSlice';
import { useNavigate } from 'react-router-dom';
import styles from './OrdersReferences.module.css';
import BookingPopup from './BookingPopup';
import BookingPopupDetails from './BookingPopupDetails';
import CancelPopup from './CancelPopup';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const OdersAndReferences = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const references = useSelector(state => state.Reference.references);
    const status = useSelector(state => state.Reference.status);
    const customers = useSelector(state => state.Customer.Customers);
    const user = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const statuss = useSelector(state => state.Status.statuss);

    const [activeBooking, setActiveBooking] = useState(null);
    const [activeBookingDetails, setActiveBookingDetails] = useState(null);
    const [activeCancelBooking, setActiveCancelBooking] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadData = async () => {
            if (!status) await dispatch(InitReferences());
            await dispatch(InitWorkShops());
            await dispatch(fetchStatus());
        };
        loadData();
    }, [status, dispatch]);

    const customer = code => customers.find(c => c.code === code);
    const getWorkshop = code => workshops.find(w => w.code === code);
    const codeDiagnoser = code => getWorkshop(code)?.codeDiagnoser || '';
    const getDiagnoser = code => diagnosers.find(d => d.code === codeDiagnoser(code));
    const priceWorkshop = code => getWorkshop(code)?.price || 0;
    const getTypeGroup = code => statuss.find(t => t.code == code)?.description;

    const filteredpay = references?.filter(d => {
        if (filter === "all") return true;
        if (filter === "0" && d.status == 3) return true;
        if (filter === "1" && d.status == 2) return true;
        return false;
    });

    const filtered = useMemo(() =>
        filteredpay.filter(s =>
            `${getDiagnoser(s.codeWorkshop)?.name} ${customer(s.codeCustomer)?.name}`.toLowerCase()
                .includes(search.toLowerCase())
        ), [filteredpay, search]);

    const handleApprove = booking => setActiveBooking({ ...booking });
    const handleCancel = () => setActiveBooking(null);
    const handleCancelDetails = () => setActiveBookingDetails(null);
    const handleOpenCancelPopup = async booking => {
        await dispatch(GetDiagnosersOfThisWorkshop(getWorkshop(booking.codeWorkshop)));
        setActiveCancelBooking(booking);
    };
    const handleCloseCancelPopup = () => setActiveCancelBooking(null);
    const handleConfirmCancel = async () => {
        if (!activeCancelBooking) return;
        await dispatch(deleteReference(activeCancelBooking)).unwrap();
        dispatch(InitReferences());
        setActiveCancelBooking(null);
    };

    if (!status || status === "loading") return <>טוען נתונים...</>;

    return (
        <div className={styles.diagnoserPage}>
            {/* SEARCH + FILTER */}
            <div className={styles.searchFiltersRow}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="חיפוש לפי שם, תחום או תאריך..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">הכל</option>
                    <option value="1">שולם</option>
                    <option value="0">לא שולם</option>
                </select>
            </div>

            <div className={styles.tablesWrapper}>



                {/* תורים פעילים */}
                <div className={styles.tableCard}>
                    <div className={styles.tableTitle}>תורים פעילים</div>
                    <table className={styles.modernTable}>
                        <thead>
                            <tr>
                                <th className={styles.dateCol}><FaCalendarAlt /> תאריך</th>
                                <th><FaUser /> לקוח</th>
                                {statusUser === "Esty" && <th>מאבחנת</th>}
                                <th>תשלום</th>
                                <th>סטטוס</th>
                                <th>סדנא</th>
                                <th>פעולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (r.status != 1 && (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) && (
                                <tr key={i} className={styles.hoverRow}>
                                    <td>{r.date}</td>
                                    <td className={styles.customerCell}> {customer(r.codeCustomer)?.name}</td>
                                    {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.name}</td>}
                                    <td>{priceWorkshop(r.codeWorkshop)}</td>
                                    <td className={r.status == 3 ? styles.unpaid : ''}>{getTypeGroup(r.status)}</td>
                                    <td>
                                        <button className={styles.workshopBtn} onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}>
                                            {r.codeWorkshop}
                                        </button>
                                    </td>
                                    <td>
                                        <button className={styles.detailsButton} onClick={() => setActiveBookingDetails(r)}>פרטים</button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>

                {/* תורים ממתינים */}
                <div className={styles.tableCard}>
                    <div className={styles.tableTitle}>תורים ממתינים</div>
                    <table className={styles.modernTable}>
                        <thead>
                            <tr>
                                <th className={styles.dateCol}><FaCalendarAlt /> תאריך</th>
                                <th><FaUser /> לקוח</th>
                                {statusUser === "Esty" && <th>מאבחנת</th>}
                                <th>סדנא</th>
                                <th>פעולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) =>
                             (r.status == 1 && 
                                (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) && (
                                <tr key={i} className={styles.hoverRow}>
                                    <td>{r.date}</td>
                                    <td className={styles.customerCell}> {customer(r.codeCustomer)?.name}</td>
                                    {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.name}</td>}
                                    <td>
                                        <button className={styles.workshopBtn} onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}>
                                            {r.codeWorkshop}
                                        </button>
                                    </td>
                                    <td>
                                        <button className={`${styles.profileButton} ${styles.approveButton}`} onClick={() => handleApprove(r)}>אשר</button>
                                        <button className={`${styles.profileButton} ${styles.cancelButton}`} onClick={() => handleOpenCancelPopup(r)}>ביטול</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingPopupDetails booking={activeBookingDetails} handleCancel={handleCancelDetails} getDiagnoser={getDiagnoser} customer={customer} />
            <CancelPopup booking={activeCancelBooking} customer={customer} handleCancel={handleCloseCancelPopup} handleConfirm={handleConfirmCancel} />
            <BookingPopup booking={activeBooking} customer={customer} handleSave={() => { }} handleCancel={handleCancel} setBooking={setActiveBooking} />
        </div>
    );
};

export default OdersAndReferences;