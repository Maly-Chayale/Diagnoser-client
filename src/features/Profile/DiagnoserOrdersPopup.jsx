import React, { useMemo } from 'react';
import styles from './DiagnoserOrdersPopup.module.css';
import { useNavigate } from 'react-router-dom';

const DiagnoserOrdersPopup = ({
    booking,
    references,
    workshops,
    customer,
    handleCancel
}) => {
    const navigate = useNavigate()
    // בניית lookup מהירה למחירים
    const workshopMap = useMemo(() => {
        const map = new Map();
        workshops.forEach(w => map.set(Number(w.code), w));
        return map;
    }, [workshops]);

    // סינון הזמנות ששייכות למאבחנת דרך workshops
    const orders = useMemo(() => {
        if (!booking) return [];

        const diagnoserWorkshopCodes = workshops
            .filter(w => Number(w.codeDiagnoser) === Number(booking.code))
            .map(w => Number(w.code));

        return references.filter(r =>
            diagnoserWorkshopCodes.includes(Number(r.codeWorkshop))
        );
    }, [booking, workshops, references]);

    const getPrice = (codeWorkshop) => {
        return workshopMap.get(Number(codeWorkshop))?.price || 0;
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>

                {/* Header */}
                <div className={styles.header}>
                    <h2>תורים של {booking?.name}</h2>

                    <button
                        className={styles.closeButton}
                        onClick={handleCancel}
                    >
                        X
                    </button>
                </div>

                {/* Table */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>תאריך</th>
                            <th>לקוח</th>
                            <th>תשלום</th>
                            <th>סטטוס</th>
                            <th>סדנה</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, idx) => (
                                <tr
                                    key={idx}
                                    className={
                                        order.status === 3
                                            ? styles.paidRow
                                            : styles.unpaidRow
                                    }
                                >
                                    <td>{order.date}</td>


                                    <td>
                                        {customer(order.codeCustomer)?.name || 'לא נמצא'}
                                    </td>

                                    <td>
                                        {getPrice(order.codeWorkshop).toLocaleString()} ₪
                                    </td>

                                    <td>
                                        {order.status === 3 ? "שולם" : "לא שולם"}
                                    </td>

                                    <td>
                                        <button
                                            className={styles.workshopLinkBtn}
                                            onClick={() => navigate(`/WorkshopDetails/${order.codeWorkshop}`)}
                                        >
                                            {order.codeWorkshop}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* חשוב: colSpan חייב להיות 6 */}
                                <td colSpan="6">אין תורים להצגה</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default DiagnoserOrdersPopup;