import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitCustomer } from './CustomerSlice';
import style from './CustomersList.module.css'
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import OrderOfCusatomer from './OrderOfCusatomer';
import { useNavigate } from 'react-router-dom';

const CustomersList = () => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.Customer.Customers);
    const status = useSelector(state => state.Customer.status);

    const [search, setSearch] = useState("");
    const navigate = useNavigate()

    const string = (s) => s.name + " " + s.mail + " " + s.phone;

    const filteredSlots = useMemo(() =>
        customers.filter(s => string(s).toLowerCase().includes(search.toLowerCase())),
        [customers, search]
    );

    useEffect(() => {
        if (status === "")
            dispatch(InitCustomer());
    }, [status, dispatch]);

    const highlight = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className={style.highlight}>{part}</mark>
                : part
        );
    };

    if (status === "" || status === "loading") {
        return <div className={style.loading}>טוען נתונים...</div>;
    }

    if (status === "faild") {
        return <div className={style.error}>שגיאה בטעינה</div>;
    }

    return (
        <div className={style["customers-page"]}>
            <div className={style["search-row"]}>
                <input
                    type="text"
                    className={style["search-input"]}
                    placeholder="חפש לקוח לפי שם, אימייל או טלפון..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className={style["cards-grid"]}>
                {filteredSlots.map(c => (
                    <div key={c.mail} className={style.card}>
                        <h2 className={style.name}>{highlight(c.name, search)}</h2>
                        <div className={style.infoRow}>
                            <FaEnvelope className={style.icon} />
                            <span className={style.infoText}>{highlight(c.mail, search)}</span>
                        </div>
                        <div className={style.infoRow}>
                            <FaPhone className={style.icon} />
                            <span className={style.infoText}>{highlight(c.phone, search)}</span>
                        </div>
                        <p className={style.description}>לקוח מרוצה ומעודכן.</p>
                        {/* <button className={style.orderBtn} onClick={
                            <OrderOfCusatomer />
                        }>הצג הזמנות</button> */}
                        <button
                            className={style.orderBtn}
                            onClick={() => navigate(`/OrderOfCusatomer/${c.code}`)}

                        >הצג הזמנות </button>


                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomersList;