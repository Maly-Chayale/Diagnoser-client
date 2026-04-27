

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWorkShop, GetDiagnosersOfConditions, GetDiagnosersOfThisWorkshop, getType, InitWorkShops } from './WorkShopSlice';  // נניח שיש פעולה כזו להוסיף סדנא
import './AppointmentCard.css';
import { fetchTypeGroups } from '../TypeGroup/TypeGroupSlice';
import AppointmentCard from './AppointmentCard';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';

function Workshop() {

    const dispatch = useDispatch()
    const workshops = useSelector(state => state.WorkShop.WorkShops)
    const status = useSelector(state => state.WorkShop.status)
    const statusT = useSelector(state => state.TypeGroup.status)
    const diagnosers = useSelector(state => state.WorkShop.Diagnosers);  // המאבחנות
    const alldiagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const typeGroups = useSelector(state => state.TypeGroup.groups); // קבוצות הסוגים
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWorkshop, setNewWorkshop] = useState({
        code: 0,
        codeDiagnoser: 0,
        typeGroup: 0,
        description: '',
        morfology: false,
        grafology: false,
        chirology: false,
        price: 0,
        accontOfPeople: 0
    });
    const string = (s) => {
        let string = dispatch(getType(s)).arg.description
        if (s.graphology)
            string += " גרפולוגיה"
        if (s.morphology)
            string += " מורפולוגיה"
        if (s.chirology)
            string += " כירולוגיה "
        string += diagnoser(s)
        string += " " + s.description
        return string
    }
    const diagnoser = (w) => {
        return alldiagnosers.filter(d => d.code == w.codeDiagnoser)[0]?.name
    }
    const [search, setSearch] = useState("");

    const filteredSlots = useMemo(() =>
        workshops.filter(s => (string(s)).toLowerCase().includes(search.toLowerCase())), [workshops, search]);


    useEffect(() => {
        if (status == "" || status == "faild")
            dispatch(InitWorkShops())
        if (statusT == "" || statusT == "faild")
            dispatch(fetchTypeGroups())
        dispatch(InitDiagnoser())
    }, [status, dispatch])


    // פונקציה לפתיחת הפופ-אפ
    const openModal = () => {
        setIsModalOpen(true);
    };

    // פונקציה לסגירת הפופ-אפ
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // פונקציה להוספת סדנא
    const   handleAddWorkshop = async () => {
       await dispatch(addWorkShop(newWorkshop));  // פעולה להוספת סדנא
       await dispatch(InitWorkShops())
        closeModal();  // סוגר את הפופ-אפ אחרי ההוספה
    };

    // עדכון פרטי הסדנא
    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        await setNewWorkshop({
            ...newWorkshop,
            [name]: type === 'checkbox' ? checked : value,
        });
        await dispatch(GetDiagnosersOfConditions({ c: newWorkshop.chirology, g: newWorkshop.grafology, m: newWorkshop.morfology }))
    };




    if (status === "") return <div id="text">טוען נתונים...</div>
    if (status === "loading") return <div id="text">טוען נתונים...</div>
    if (status === "faild") return <div id="text">נכשל</div>


    return (
        <div>






            <div className="search-row">
                <input type="text" className="search-input" placeholder="חיפוש לפי שם מאבחנת, תחום, תאריך או שעה..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>





            {/* כפתור הוספת סדנא */}
            <button className="primary" onClick={openModal}>הוספת סדנא</button>
            {filteredSlots.map(w => (
                <AppointmentCard key={w.code} WorkShop={w} />
            ))}
            {/* פופ-אפ למילוי פרטי הסדנא */}
            {isModalOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>הוספת סדנא</h3>
                        <button className="close-btn" onClick={closeModal}>X</button>

                        {/* טופס מילוי פרטי הסדנא */}
                        <div>
                            <label>תיאור הסדנא:</label>
                            <textarea
                                name="description"
                                value={newWorkshop.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>מחיר:</label>
                            <input
                                type="number"
                                name="price"
                                value={newWorkshop.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>מספר משתתפים:</label>
                            <input
                                type="number"
                                name="accontOfPeople"
                                value={newWorkshop.accontOfPeople}
                                onChange={handleChange}
                            />
                        </div>

                        {/* תיבת בחירה נגללת עבור קבוצת הסוג */}
                        <div>
                            <label>בחר סוג קבוצה:</label>
                            <select
                                name="typeGroup"
                                value={newWorkshop.typeGroup}
                                onChange={handleChange}
                            >
                                <option value="">בחר קטגוריה</option>
                                {typeGroups.map((group) => (
                                    <option key={group.code} value={group.code}>
                                        {group.description}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* תיבות סימון עבור קטגוריות */}
                        <div>
                            <label>מורפולוגיה:</label>
                            <input
                                type="checkbox"
                                name="morfology"
                                checked={newWorkshop.morfology}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>גרפולוגיה:</label>
                            <input
                                type="checkbox"
                                name="grafology"
                                checked={newWorkshop.grafology}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>כירולוגיה:</label>
                            <input
                                type="checkbox"
                                name="chirology"
                                checked={newWorkshop.chirology}
                                onChange={handleChange}
                            />
                        </div>

                        {/* תיבת בחירה נגללת עבור מאבחנות */}
                        <div>
                            <label>בחר מאבחנת:</label>
                            <select
                                name="codeDiagnoser"
                                value={newWorkshop.codeDiagnoser}
                                onChange={handleChange}
                            >
                                <option value="">בחר מאבחנת</option>
                                {diagnosers.map((diagnoser) => (
                                    <option key={diagnoser.code} value={diagnoser.code}>
                                        {diagnoser.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* כפתור אישור */}
                        <button className="primary" onClick={handleAddWorkshop}>אישור</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Workshop;