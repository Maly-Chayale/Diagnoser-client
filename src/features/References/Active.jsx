

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, closeOrder, InitReferences, updateReference } from './ReferencesSlice';
import { InitWorkShops } from '../WorkShop/WorkShopSlice';
import { fetchStatus } from '../Statuss/StatusSlice';
import { useNavigate } from 'react-router-dom';
import './DiagnoserProfil.css';
import { payToManager } from '../Diagnosers/DiagnoserSlice';

const Active = ({searchS}) => {
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
    const [amountPaid, setAmountPaid] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState(searchS);

    useEffect(() => {
        const loading = async () => {
            if (!status) await dispatch(InitReferences());
            await dispatch(InitWorkShops());
            await dispatch(fetchStatus());
        };
        loading();
    }, [status, dispatch]);

    const customerName = (code) => customers.find(c => c.code === code)?.name || '';
    const getWorkshop = (code) => workshops.find(w => w.code === code);
    const codeDiagnoser = (code) => getWorkshop(code)?.codeDiagnoser || '';
    const getNameDiagnoser = (code) => diagnosers.find(d => d.code === codeDiagnoser(code))?.name || '';
    const priceWorkshop = (code) => getWorkshop(code)?.price || 0;
    const getTypeGroup = (code) => statuss.find(t => t.code == code)?.description;

    useEffect(() => {
        if (references.length && user) {
            const total = user.precentagePayment;
            setRemaining(total);
        }
    }, [references, user]);

    const string = (d) => {
        return (
            getNameDiagnoser(d.codeWorkshop).toLowerCase() + " " +
            d.date +
            customerName(d.codeCustomer).toLowerCase() +
            d.comments + " " + d.adress +
            " " + d.codeWorkshop
        );
    }

    const filteredpay = references?.filter((d) => {
        if (filter === "all") return true;
        if (filter === "0" && d.status == 3) return true;
        if (filter === "1" && d.status == 2) return true;
        return false;
    });

    const filtered = useMemo(() =>
        filteredpay.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase())), [filteredpay, search]);

    if (!status || status === "loading") return <>טוען נתונים...</>;

    const handleCancel = () => setActiveBooking(null);

    return (
        <div className="diagnoser-page">
            {/* <div className="search-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div> */}

            <div className="filters-row">
                <label className="filter-label">
                    סינון:
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">הכל</option>
                        <option value="1">שולם</option>
                        <option value="0">לא שולם</option>
                    </select>
                </label>
            </div>

            <div className="tables-wrapper">
                <div className="table-card fade-in">
                    <div className="table-title">תורים פעילים</div>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>שעה</th>
                                <th>לקוח</th>
                                {(statusUser === "Esty" && <th>מאבחנת</th>)}
                                <th>סדנא</th>
                                <th>תשלום</th>
                                <th>אחוזים</th>
                                <th>סטטוס</th>
                                <th>פרטים</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => {
                                if (r.status != 1 && (statusUser === "Esty" || codeDiagnoser(r.codeWorkshop) === user.code)) {
                                    return (
                                        <tr key={i}>
                                            <td>{r.date}</td>
                                            <td>{r.time}</td>
                                            <td>{customerName(r.codeCustomer)}</td>
                                            {(statusUser === "Esty" && <td>{getNameDiagnoser(r.codeWorkshop)}</td>)}
                                            <td>
                                                <button className='link-btn' onClick={() => navigate(`/WorkshopDetails/${r.codeWorkshop}`)}>
                                                    {r.codeWorkshop}
                                                </button>
                                            </td>
                                            <td>{priceWorkshop(r.codeWorkshop)}</td>
                                            <td>{priceWorkshop(r.codeWorkshop) * 0.1}</td>
                                            <td>{getTypeGroup(r.status)}</td>
                                            <td>
                                                <button className="details-button" onClick={() => setActiveBooking(r)}>פרטים</button>
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </div>

                {activeBooking && (
                    <div className="popup-overlay" onClick={handleCancel}>
                        <div className="popup-content slide-in" onClick={e => e.stopPropagation()}>
                            <h3>פרטי הזמנה: {activeBooking.codeWorkshop}</h3>
                            <p><strong>לקוח:</strong> {customerName(activeBooking.codeCustomer)}</p>
                            <p><strong>תאריך:</strong> {activeBooking.date}</p>
                            <p><strong>שעה:</strong> {activeBooking.time}</p>
                            <p><strong>כתובת:</strong> {activeBooking.adress}</p>
                            <p><strong>מאבחנת:</strong> {getNameDiagnoser(activeBooking.codeWorkshop)}</p>
                            <p><strong>סדנא:</strong> {activeBooking.codeWorkshop}</p>
                            <p><strong>סטטוס:</strong> {getTypeGroup(activeBooking.status)}</p>
                            <p><strong>הערות:</strong> {activeBooking.comments}</p>
                            <div className="button-container">
                                <button className="profile-button cancel-button" onClick={handleCancel}>סגור</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Active;