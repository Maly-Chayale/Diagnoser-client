import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios"
// import './old.css'
import { useDispatch, useSelector } from 'react-redux';
import { InitLeads } from './LeadsSlice';
import style from '../Customers/CustomersList.module.css'


const LeadsList = () => {

    const dispatch = useDispatch()

    const leads = useSelector(state => state.Lead.Leads)
    const status = useSelector(state => state.Lead.status)

     const string = (s) => {
        let string = s.name+" "+s.mail+" "+s.phone
        return string
    }
    
    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(() =>
        leads?.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase())), [leads, search]);



    useEffect(() => {
        // if(status=="")
        console.log(filteredSlots);
        
            dispatch(InitLeads())
    }, [status, dispatch])
// useEffect(()=>{
//   if(leads.length>0)

// },[leads])
    return (

        <div>
            {/* <button onClick={()=>{fun()}}></button> */}
            <div className="clients-page">
                <div className="search-row">
                    <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="clients-grid">
                    <h1 className="clients-title">מתעניינים</h1>
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
export default LeadsList;








