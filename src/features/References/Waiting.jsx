import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, closeOrder, InitReferences, updateReference } from './ReferencesSlice';
import { InitWorkShops } from '../WorkShop/WorkShopSlice';
import { fetchStatus } from '../Statuss/StatusSlice';
import { useNavigate } from 'react-router-dom';
import './DiagnoserProfil.css';
import { payToManager } from '../Diagnosers/DiagnoserSlice';

const Waiting = ({ searchS }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const references = useSelector(state => state.Reference.references);
    const status = useSelector(state => state.Reference.status);
    const customers = useSelector(state => state.Customer.Customers);
    const user = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
    // const statuss = useSelector(state => state.Status.statuss);
    const [lp, setAsetlp] = useState(null);

    const [activeBooking, setActiveBooking] = useState(null); // לאחסון ההזמנה שנבחרה לעריכה

    // useEffect(() => {
    //     const loading = async () => {
    //         if (!status) await dispatch(InitReferences());
    //         await dispatch(InitWorkShops());
    //         await dispatch(fetchStatus())
    //     };
    //     loading();
    // }, [status, dispatch]);

    const customerName = (code) => customers.find(c => c.code === code)?.name || '';
    const getWorkshop = (code) => workshops.find(w => w.code === code);
    // const getTypeGroup = (code) => statuss.find(t => t.code == code)?.description;
    // const priceWorkshop = (code) => getWorkshop(code)?.price || 0;
    const codeDiagnoser = (code) => getWorkshop(code)?.codeDiagnoser || '';
    const getNameDiagnoser = (code) => diagnosers.find(d => d.code == codeDiagnoser(code))?.name || '';
    // const [amountPaid, setAmountPaid] = useState(0);
    // const [remaining, setRemaining] = useState(0);


    // const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState(searchS);


    // useEffect(() => {
    //     if (references.length && user) {
    //         const total = user.precentagePayment

    //         setRemaining(total);
    //     }
    // }, [references, user]);


    // פתיחת פופאפ עם ההזמנה שנבחרה
    const handleApprove = (booking) => {
        setActiveBooking({ ...booking });
    };

    // ביטול פופאפ
    const handleCancel = () => setActiveBooking(null);

    // שמירת השינויים
    const handleSave = async () => {
        // כאן תעדכני את המידע במערכת / בשרת
        await dispatch(updateReference(activeBooking))
        await dispatch(closeOrder(activeBooking.code))
        await dispatch(close(activeBooking.code))
        console.log("Booking confirmed:", activeBooking);
        setAsetlp(activeBooking)
        await dispatch(InitReferences());
        setActiveBooking(null);
    };

    // const handlePayment = async () => {
    //     if (!amountPaid || amountPaid <= 0) return;
    //     await dispatch(payToManager({ code: user.code, num: amountPaid }));
    //     setRemaining(prev => prev - amountPaid);
    //     setAmountPaid(0);
    // };


    const string = (d) => {
        let string = getNameDiagnoser(d.codeWorkshop).toLowerCase() + " "
            + d.date +
            customerName(d.codeCustomer).toLowerCase()
            + d.comments + " " + d.adress +
            " " + d.codeWorkshop
        return string
    }

    // const filteredpay = references?.filter((d) => {
    //     if (filter === "all") return true;
    //     if (filter === "0" && d.status == 3) return true;
    //     if (filter === "1" && d.status == 2) return true;
    //     return false;
    // });

    // useEffect(() => {
    //     let x = filter
    //     setFilter("2")
    //     setFilter(x)
    // }, search)

    const filtered = useMemo(() =>
        references
    // .filter(r => r.status === 1)
    .filter(s => (string(s)).toLowerCase().includes(search.toLowerCase))
    , [references, search]);

    if (!status || status === "loading") return <>טוען נתונים...</>;


    return (
        <div className="diagnoser-page">





            <div className="tables-wrapper">

                {/* טבלה שמאלית - תורים בהמתנה */}
                <div className="table-card fade-in delay">
                    <div className="table-title">תורים ממתינים</div>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>לקוח</th>
                                {(statusUser === "Esty" && <th>מאבחנת</th>)}
                                <th>סדנא</th>
                                <th>פעולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => {
                                if (r.status == 1 && (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) {
                                    return (
                                        <tr key={i}>
                                            <td>{r.date}</td>
                                            <td>{customerName(r.codeCustomer)}</td>
                                            {(statusUser === "Esty" && <td>{getNameDiagnoser(r.codeWorkshop)}</td>)}
                                            <td>
                                                <button className='link-btn' onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}>
                                                    {r.codeWorkshop}
                                                </button>
                                            </td>
                                            <td>
                                                <button className="profile-button" onClick={() => handleApprove(r)}>אשר</button>
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </div>

                {/* פופאפ לעריכת ההזמנה */}
                {activeBooking && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>אישור סדנא {activeBooking.codeWorkshop}</h3>
                            <p>לקוח: {customerName(activeBooking.codeCustomer)}</p>

                            <label>תאריך:</label>
                            <input type="date" value={activeBooking.date} onChange={e => setActiveBooking({ ...activeBooking, date: e.target.value })} />

                            <label>שעה:</label>
                            <input type="number" value={activeBooking.time} onChange={e => setActiveBooking({ ...activeBooking, time: e.target.value })} />

                            <label>כתובת:</label>
                            <input type="text" value={activeBooking.adress} onChange={e => setActiveBooking({ ...activeBooking, adress: e.target.value })} />

                            <label>הערות:</label>
                            <input type="text" value={activeBooking.comments} onChange={e => setActiveBooking({ ...activeBooking, comments: e.target.value })} />

                            <div className="button-container">
                                <button className="profile-button" onClick={handleSave}>אישור</button>
                                <button className="profile-button cancel-button" onClick={handleCancel}>ביטול</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default Waiting;


