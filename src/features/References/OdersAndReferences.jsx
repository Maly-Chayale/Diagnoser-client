import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeOrder, close, deleteReference, InitReferences, updateReference } from './ReferencesSlice';
import { GetDiagnosersOfThisWorkshop, InitWorkShops } from '../WorkShop/WorkShopSlice';
import { fetchStatus } from '../Statuss/StatusSlice';
import { useNavigate } from 'react-router-dom';
import styles from './OrdersReferences.module.css';
import BookingPopupOk from './BookingPopupOk';
import BookingPopupDetails from './BookingPopupDetails';
import CancelPopup from './CancelPopup';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import { sendEmail } from '../Email/EmailSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import { InitCustomer } from '../Customers/CustomerSlice';

const OdersAndReferences = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const references = useSelector(state => state.Reference.references);
    const statusR = useSelector(state => state.Reference.status);
    const customers = useSelector(state => state.Customer.Customers);
    const statusC = useSelector(state => state.Customer.status);
    const user = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const statusW = useSelector(state => state.WorkShop.status);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const statusD = useSelector(state => state.Diagnoser.status);
    const diagnosersOfWorkshop = useSelector(state => state.WorkShop.Diagnosers);
    const statuss = useSelector(state => state.Status.statuss);
    const status = useSelector(state => state.Status.status);

    const [activeBooking, setActiveBooking] = useState(null);
    const [activeBookingDetails, setActiveBookingDetails] = useState(null);
    const [activeCancelBooking, setActiveCancelBooking] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                if (statusD === "faild" || statusD === "")
                    await dispatch(InitDiagnoser()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusD, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (status === "faild" || status === "")
                    await dispatch(fetchStatus()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [status, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusC === "faild" || statusC === "")
                    await dispatch(InitCustomer()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusC, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusR === "faild" || statusR === "")
                    await dispatch(InitReferences()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusR, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusW === "faild" || statusW === "")
                    await dispatch(InitWorkShops()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusW, dispatch]);

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


    const workshopDiagnoser = (code) => {
        return workshops.filter(w => w.codeDiagnoser === code)
    }

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
        const workshop = getWorkshop(activeCancelBooking.codeWorkshop);
        if (!workshop) {
            console.error("Workshop not found for code:", activeCancelBooking.codeWorkshop);
            return;
        }
        const customerData = customer(activeCancelBooking.codeCustomer);
        if (!customerData) {
            console.error("Customer not found for code:", activeCancelBooking.codeCustomer);
            return;
        }
        try {
            await dispatch(GetDiagnosersOfThisWorkshop(workshop));
        } catch (err) {
            console.error("Error fetching diagnosers:", err);
            return;
        }
        if (!Array.isArray(diagnosersOfWorkshop)) {
            console.warn("No alternative diagnosers available");
        }
        const morf = workshop.morfology;
        const graf = workshop.grafology;
        const chi = workshop.chirology;
        const typeGroup = workshop.typeGroup;
        const tableRows = (diagnosersOfWorkshop || []).filter(d => d.code !== workshop.codeDiagnoser)
            .map((d, index) => {
                const w = workshopDiagnoser(d.code).find(w =>
                    w.morfology === morf &&
                    w.grafology === graf &&
                    w.chirology === chi &&
                    w.typeGroup === typeGroup
                );
                return `<tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
            <td style="padding: 8px; border: 1px solid #ccc;">${d.name || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${d.mail || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">
                ${w?.accontOfPeople || 0}
            </td>
            <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">
                ${w?.price || 0}
            </td>
        </tr>`;
            }).join("");
        const mailBody = `
        <p>שלום ${customerData.name},</p>
        <p>לצערנו, המאבחנת שנבחרה לסדנא <strong>${workshop.code}</strong> אינה זמינה.</p>
        ${diagnosersOfWorkshop.length === 0 ? `<p>להלן המאבחנות החלופיות עם פרטי הסדנא:</p>
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <thead>
                <tr style="background-color: #007BFF; color: white;">
                    <th style="padding: 8px; border: 1px solid #ccc;">שם</th>
                    <th style="padding: 8px; border: 1px solid #ccc;">מייל</th>
                    <th style="padding: 8px; border: 1px solid #ccc;">כמות משתתפים</th>
                    <th style="padding: 8px; border: 1px solid #ccc;">כסף</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>` : `<p>אין מאבחנות חילופיות</p>`}
        <p>בברכה,</p>
        <p>צוות הסדנאות</p>
    `;
        const mailSubject = `ביטול סדנא ${workshop.code}`;
        try {
            await dispatch(deleteReference(activeCancelBooking)).unwrap();
            // await dispatch(InitReferences());
            setActiveCancelBooking(null);
            await dispatch(sendEmail(customerData.mail, mailSubject, mailBody));
        } catch (err) {
            console.error("Error in cancel workflow:", err);
        }
    };

    const handleSave = async () => {
        await dispatch(updateReference(activeBooking))
        await dispatch(closeOrder(activeBooking.code))
        await dispatch(close(activeBooking.code))
        await dispatch(InitReferences())
        setActiveBooking(null)
    }

    if (statusC !== "succesfull" || statusD !== "succesfull" || status !== "succesfull" || statusR !== "succesfull" || statusW !== "succesfull") return <>טוען נתונים...</>

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
            <BookingPopupOk booking={activeBooking} customer={customer} handleSave={handleSave} handleCancel={handleCancel} setBooking={setActiveBooking} />
        </div>
    );
};

export default OdersAndReferences;