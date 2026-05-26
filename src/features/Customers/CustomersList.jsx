import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitCustomer } from './CustomerSlice';
import style from './CustomersList.module.css'
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import OrderOfCusatomer from './OrderOfCusatomer';
import { useNavigate } from 'react-router-dom';

const CustomersList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const customers = useSelector(state => state.Customer.Customers);
    const status = useSelector(state => state.Customer.status);

    const [search, setSearch] = useState("");

    const string = (s) => s.name + " " + s.mail + " " + s.phone;

    const filteredSlots = useMemo(() =>
        customers.filter(s => string(s).toLowerCase().includes(search.toLowerCase())),
        [customers, search]
    );

    useEffect(() => {
        const load = async () => {
            try {
                if (status === "faild" || status === "")
                    await dispatch(InitCustomer()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
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

  if (status !== "succesfull") return <>טוען נתונים...</>

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
                        {/* <button
                            className={style.orderBtn}
                            onClick={<OrderOfCusatomer 
                                  code = {code}
                                />
                            }

                        >הצג הזמנות </button> */}

                        {/* פופאפ */}
                        {/* <BookingPopup
                            booking={activeBooking}
                            customer={customer}
                            // getDiagnoser={getDiagnoser}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            setBooking={setActiveBooking}
                        /> */}


                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomersList;