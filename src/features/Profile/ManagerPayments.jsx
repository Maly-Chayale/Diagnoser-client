import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaDollarSign, FaEye } from 'react-icons/fa';
import styles from './ManagerPayments.module.css';

const ManagerPayments = () => {

    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const string = (s) => `${s.name} ${s.mail} ${s.precentagePayment}`;
    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(
        () => diagnosers.filter(s => string(s).toLowerCase().includes(search.toLowerCase())),
        [diagnosers, search]
    );

    return (
        <div className={styles["payments-page"]}>
            <div className={styles["search-row"]}>
                <input
                    type="text"
                    className={styles["search-input"]}
                    placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className={styles["table-card"]}>
                {/* <div className={styles["table-title"]}>התחשבנות מאבחנות</div> */}



                <table className={styles["modern-table"]}>
                    <thead>
                        <tr>
                            <th><FaUser /> שם מאבחנת</th>
                            <th><FaEnvelope /> מייל</th>
                            <th><FaPhone /> פלאפון</th>
                            <th><FaDollarSign /> נותר לתשלום</th>
                            <th><FaEye /> צפייה בתורים</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSlots
                            .filter(d => d.mail !== '22@2' && d.precentagePayment > 0)
                            .map((d, i) => (
                                <tr key={i} className={styles["table-row"]}>
                                    <td>{d.name}</td>
                                    <td>{d.mail}</td>
                                    <td>{d.phone}</td>
                                    <td>{d.precentagePayment}</td>
                                    <td>
                                        <button className={styles["view-btn"]}><FaEye /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerPayments;