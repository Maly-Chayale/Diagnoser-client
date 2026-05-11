import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, closeOrder, InitReferences, updateReference } from './ReferencesSlice';
import { InitWorkShops } from '../WorkShop/WorkShopSlice';
import { fetchStatus } from '../Statuss/StatusSlice';
import { useNavigate } from 'react-router-dom';
import './DiagnoserProfil.css';
import { payToManager } from '../Diagnosers/DiagnoserSlice';
import BookingPopup from './BookingPopup';
import BookingPopupDetails from './BookingPopupDetails';

const OdersAndReferences = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const references = useSelector(state => state.Reference.references);
    const status = useSelector(state => state.Reference.status);
    const customers = useSelector(state => state.Customer.Customers);
    const user = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
    const statuss = useSelector(state => state.Status.statuss);

    const [activeBooking, setActiveBooking] = useState(null);
    const [activeBookingDetails, setActiveBookingDetails] = useState(null);
    const [amountPaid, setAmountPaid] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loading = async () => {
            if (!status) await dispatch(InitReferences());
            await dispatch(InitWorkShops());
            await dispatch(fetchStatus())
        };
        loading();
    }, [status, dispatch]);

    const customer = (code) => customers.find(c => c.code === code);
    const getWorkshop = (code) => workshops.find(w => w.code === code);
    const codeDiagnoser = (code) => getWorkshop(code)?.codeDiagnoser || '';
    const getDiagnoser = (code) => diagnosers.find(d => d.code === codeDiagnoser(code));
    const priceWorkshop = (code) => getWorkshop(code)?.price || 0;
    const getTypeGroup = (code) => statuss.find(t => t.code == code)?.description;

    useEffect(() => {
        if (references.length && user) {
            setRemaining(user.precentagePayment);
        }
    }, [references, user]);

    const handleApprove = (booking) => setActiveBooking({ ...booking });
    const handleCancel = () => setActiveBooking(null);
    const handleCancelDetails = () => setActiveBookingDetails(null);
    const handleSave = async () => {
        await dispatch(updateReference(activeBooking));
        await dispatch(closeOrder(activeBooking.code));
        await dispatch(close(activeBooking.code));
        await dispatch(InitReferences());
        setActiveBooking(null);
    };
    const handlePayment = async () => {
        if (!amountPaid || amountPaid <= 0) return;
        await dispatch(payToManager({ code: user.code, num: amountPaid }));
        setRemaining(prev => prev - amountPaid);
        setAmountPaid(0);
    };

    const string = (d) => {
        const diag = getDiagnoser(d.codeWorkshop);
        return diag?.name + " " +
            diag?.mail + " " +
            d.date +
            customer(d.codeCustomer)?.name +""+
            customer(d.codeCustomer)?.mail +
            d.comments + " " + d.adress + " " + d.codeWorkshop
    }

    const filteredpay = references?.filter((d) => {
        if (filter === "all") return true;
        if (filter === "0" && d.status == 3) return true;
        if (filter === "1" && d.status == 2) return true;
        return false;
    });

    const filtered = useMemo(() =>
        filteredpay.filter(s => string(s).toLowerCase().includes(search.toLowerCase())), [filteredpay, search]);

    if (!status || status === "loading") return <>טוען נתונים...</>;

    return (
        <div className="diagnoser-page">
            <div className="search-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="filters-row">
                <label className="filter-label">
                    סינון:
                    <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">הכל</option>
                        <option value="1">שולם</option>
                        <option value="0">לא שולם</option>
                    </select>
                </label>
            </div>

            <div className="tables-wrapper">
                {/* טבלה ימנית - תורים פעילים */}
                <div className="table-card fade-in">
                    <div className="table-title">תורים פעילים</div>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                {/* <th>שעה</th> */}
                                <th>לקוח</th>
                                {/* <th>מייל לקוח</th> */}
                                {/* <th>מיקום</th> */}
                                {statusUser === "Esty" && <th>מאבחנת</th>}
                                {/* {statusUser === "Esty" && <th>מייל מאבחנת</th>} */}
                                <th>סדנא</th>
                                <th>תשלום</th>
                                <th>אחוזים</th>
                                <th>סטטוס</th>
                                {/* <th>הערות</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (
                                (r.status != 1 && (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) && (
                                    <tr key={i} className="hover-row">
                                        <td>{r.date}</td>
                                        {/* <td>{r.time}</td> */}
                                        <td>{customer(r.codeCustomer)?.name}</td>
                                        {/* <td>{customer(r.codeCustomer)?.mail}</td> */}
                                        {/* <td>{r.adress}</td> */}
                                        {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.name}</td>}
                                        {/* {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.mail}</td>} */}
                                        <td>
                                            <button className='link-btn' onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}> {r.codeWorkshop} </button>
                                        </td>
                                        <td>{priceWorkshop(r.codeWorkshop)}</td>
                                        <td>{priceWorkshop(r.codeWorkshop) * 0.1}</td>
                                        <td>{getTypeGroup(r.status)}</td>
                                        {/* <td>{r.comments}</td> */}
                                        {/* טבלה תורים פעילים */}
                                        <td>
                                            <button className="details-button" onClick={() => setActiveBookingDetails(r)}>
                                                פרטים
                                            </button>
                                        </td>


                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>

                <BookingPopupDetails
                    booking={activeBookingDetails}
                    handleCancel={handleCancelDetails} // <--- שם עקבי
                    getDiagnoser={getDiagnoser}
                    customer={customer}
                />

                {/* טבלה שמאלית - תורים בהמתנה */}
                <div className="table-card fade-in delay">
                    <div className="table-title">תורים ממתינים</div>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>לקוח</th>
                                {/* <th>מייל לקוח</th> */}
                                {statusUser === "Esty" && <th>מאבחנת</th>}
                                {/* {statusUser === "Esty" && <th>מייל מאבחנת</th>} */}
                                <th>סדנא</th>
                                <th>פעולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => (
                                (r.status == 1 && (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) && (
                                    <tr key={i} className="hover-row">
                                        <td>{r.date}</td>
                                        <td>{customer(r.codeCustomer)?.name}</td>
                                        {/* <td>{customer(r.codeCustomer)?.mail}</td> */}
                                        {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.name}</td>}
                                        {/* {statusUser === "Esty" && <td>{getDiagnoser(r.codeWorkshop)?.mail}</td>} */}
                                        <td>
                                            <button className='link-btn' onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}> {r.codeWorkshop} </button>
                                        </td>
                                        <td>
                                            <button className="profile-button" onClick={() => handleApprove(r)}>אשר</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* פופאפ */}
                <BookingPopup
                    booking={activeBooking}
                    customer={customer}
                    // getDiagnoser={getDiagnoser}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    setBooking={setActiveBooking}
                />

                {/* תיבת תשלום למשתמשים שאינם Esty */}
                {statusUser !== "Esty" && (
                    <div className="payment-box">
                        <h3>התחשבנות עם מנהלת</h3>
                        <div>נותר לתשלום: {remaining}</div>
                        <input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(Number(e.target.value))}
                            placeholder="הכנס סכום ששולם"
                        />
                        <button className="profile-button" onClick={handlePayment}>
                            אישור תשלום
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OdersAndReferences;