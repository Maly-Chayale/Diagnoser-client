import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaDollarSign, FaEye } from 'react-icons/fa';
import DiagnoserOrdersPopup from './DiagnoserOrdersPopup';
import styles from './ManagerPayments.module.css';

const ManagerPayments = () => {
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const references = useSelector(state => state.Reference.references);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const customers = useSelector(state => state.Customer.Customers);
    const statusUser = useSelector(state => state.LogIn.statusUser);

    const [search, setSearch] = useState("");
    const [selectedDiagnoser, setSelectedDiagnoser] = useState(null);

    const string = (s) => `${s.name} ${s.mail} ${s.precentagePayment}`;

    const filteredSlots = useMemo(() => {
        const sortedDiagnosers = [...diagnosers].sort((a, b) => a.name.localeCompare(b.name, 'he'));
        return sortedDiagnosers.filter(s => string(s).toLowerCase().includes(search.toLowerCase()));
    }, [diagnosers, search]);

    const handleOpenDiagnoser = (diagnoser) => {
        setSelectedDiagnoser(diagnoser);
    };

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
                        {filteredSlots.filter(d => d.mail !== "22@2").map((d, i) => (
                            <tr
                                key={i}
                                className={Number(d.precentagePayment) > 10000 ? styles["red-row"] : ""}
                            >
                                <td>{d.name}</td>
                                <td>{d.mail}</td>
                                <td>{d.phone}</td>
                                <td>{d.precentagePayment}</td>
                                <td>
                                    <button
                                        className={styles["view-btn"]}
                                        onClick={() => handleOpenDiagnoser(d)}
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedDiagnoser && (
                <DiagnoserOrdersPopup
                    booking={selectedDiagnoser}
                    references={references}
                    workshops={workshops}
                    customer={(code) => customers.find(c => c.code === code)}
                    handleCancel={() => setSelectedDiagnoser(null)}
                />
            )}
        </div>
    );
};

export default ManagerPayments;