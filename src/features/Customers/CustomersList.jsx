import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios"
import './old.css'
import { useDispatch, useSelector } from 'react-redux';
import { InitCustomer } from './CustomerSlice';

const CustomersList = () => {

    const dispatch = useDispatch()

    const customers = useSelector(state => state.Customer.Customers)
    const status = useSelector(state => state.Customer.status)

     const string = (s) => {
        let string = s.name+" "+s.mail+" "+s.phone
        return string
    }
    
    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(() =>
        customers.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase())), [customers, search]);



    useEffect(() => {
        if(status=="")
            dispatch(InitCustomer())
    }, [status, dispatch])

    return (

        <div>
            {/* <button onClick={()=>{fun()}}></button> */}
            <div className="clients-page">

                
                <div className="search-row">
                    <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>



                <div className="clients-grid">
                    <h1 className="clients-title">לקוחות</h1>
                    {filteredSlots?.map(c =>
                        <div className="client-card">
                            <div className="client-header">
                                <h2 className="client-name">{c.name}</h2>
                                <span className="client-badge">{c.mail}</span>
                                <span className="client-badge">{c.phone}</span>
                            </div>
                            <p className="client-description">אבחון גרפולוגי אישי.</p>
                            <p className="client-meta">תור אחרון: 10.02.2026 • סטטוס: הושלם</p>
                            {/* <button className="client-btn">לפרטי לקוח</button> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


}
export default CustomersList;









// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import styles from './styles.module.css'; // ייבוא CSS מודול
// import { useDispatch, useSelector } from 'react-redux';
// import { InitCustomer } from './CustomerSlice';

// const CustomersList = () => {
//     const dispatch = useDispatch();
//     const customers = useSelector(state => state.Customer.Customers);
//     const status = useSelector(state => state.Customer.status);

//     useEffect(() => {
//         if (status === "")
//             dispatch(InitCustomer());
//     }, [status, dispatch]);

//     return (
//         <div>
//             <div className={styles.clientsPage}>
//                 <div className={styles.clientsGrid}>
//                     <h1 className={styles.clientsTitle}>לקוחות</h1>
//                     {customers?.map(c => (
//                         <div className={styles.clientCard} key={c.id}>
//                             <div className={styles.clientHeader}>
//                                 <h2 className={styles.clientName}>{c.name}</h2>
//                                 <span className={styles.clientBadge}>{c.mail}</span>
//                                 <span className={styles.clientBadge}>{c.phone}</span>
//                             </div>
//                             <p className={styles.clientDescription}>אבחון גרפולוגי אישי.</p>
//                             <p className={styles.clientMeta}>תור אחרון: 10.02.2026 • סטטוס: הושלם</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CustomersList;

