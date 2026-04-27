import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { getType } from '../WorkShop/WorkShopSlice';
import { diagnoser } from '../References/ReferencesSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
// import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';


const ManagerPayments = () => {

    const references = useSelector(state => state.Reference.references);
    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);

    const getWorkshop = (code) => workshops.find(w => w.code === code);
    const priceWorkshop = (code) => getWorkshop(code)?.price || 0;
    const codeDiagnoser = (code) => getWorkshop(code)?.codeDiagnoser;

    const dispatch = useDispatch()
    
    const string = (s) => {
        let string = s.name+" "+s.mail+" "+s.precentagePayment
        return string
    }
    
    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(() =>
        diagnosers.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase())), [diagnosers, search]);



    // useEffect(() => {
    //      if (status == "" || status == "faild")
                  
    //     dispatch(InitDiagnoser())
    // }, [ dispatch])


    return (
        <div className="landing-shell">
            <div className="table-card fade-in">
                <div className="table-title">התחשבנות מאבחנות</div>



                <div className="search-row">
                    <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>






                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>שם מאבחנת</th>
                            <th>מייל</th>
                            <th>פלאפון</th>
                            <th>נותר לתשלום</th>
                            <th>לצפיה בתורים</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                        filteredSlots
                            .filter(d => d.mail != '22@2')
                          .map((d, i) => (
                                <tr key={i}>
                                    <td>{d.name}</td>
                                    <td>{d.mail}</td>
                                    <td>{d.phone}</td>
                                    <td>{d.precentagePayment}</td>                                   
                                    <td><button>לצפיה</button></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerPayments;