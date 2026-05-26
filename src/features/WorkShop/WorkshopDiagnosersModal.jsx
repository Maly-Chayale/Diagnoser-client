import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetDiagnosersOfThisWorkshop, InitWorkShops } from './WorkShopSlice';
import style from './WorkshopDiagnosersModal.module.css';
import styleDetails from './WorkshopDiagnosersModalDetails.module.css';
import { TypeGroups } from '../TypeGroup/TypeGroupSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';

function WorkshopDiagnosersModal({ WorkShop, onClose, onBooking }) {
    const dispatch = useDispatch();

    const [selectedDiagnoser, setSelectedDiagnoser] = useState(null);

    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const statusW = useSelector(state => state.WorkShop.status);
    const diagnosers = useSelector(s => s.WorkShop.Diagnosers);
    const groups = useSelector(s => s.TypeGroup.groups);
    const statusType = useSelector(s => s.TypeGroup.statusType);

    const getType = (code) => groups.find(g => g.code === code)?.description;

    useEffect(() => {
        const load = async () => {
            try {
                if (statusW === "faild" || statusW === "")
                    await dispatch(InitWorkShops()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusW, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusType === "faild" || statusType === "")
                    await dispatch(TypeGroups()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusType, dispatch]);


    useEffect(() => {
        dispatch(GetDiagnosersOfThisWorkshop(WorkShop));
    }, [dispatch, WorkShop]);

    const getWorkshop = (diagnoser) =>
        workshops.find(w =>
            w.codeDiagnoser === diagnoser.code &&
            w.morfology === WorkShop.morfology &&
            w.chirology === WorkShop.chirology &&
            w.grafology === WorkShop.grafology &&
            w.typeGroup === WorkShop.typeGroup
        );

    if (statusType !== "succesfull" || statusW !== "succesfull") return <>טוען נתונים...</>

    return (
        <div className={style.modalBackdrop}>
            <div className={style.modalBox}>
                <button className={style.closeBtn} onClick={onClose}>✕</button>

                <h4 className={style.modalTitle}>
                    {WorkShop?.morfology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                    {WorkShop?.grafology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                    {WorkShop?.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                </h4>
                <h2 className={style.workshopTypeTitle}>מיועד ל : {getType(WorkShop.typeGroup)}</h2>

                <h3 className={style.modalTitle}>מאבחנות זמינות</h3>
                <div className={style.diagnoserGrid}>
                    {diagnosers?.filter(d => d.available).map(d => (
                        <div key={d.code} className={style.diagnoserCard}>
                            <div className={style.metaBox}>
                                <span>{getWorkshop(d)?.accontOfPeople} : משתתפים 👥</span><br />
                                <span>{getWorkshop(d)?.price} : מחיר 💰</span>
                            </div>
                            <h4>{d.name}</h4>
                            <p>{d.mail}</p>

                            <div className={style.modalButtons}>
                                <button className={style.primaryBtn} onClick={() => onBooking(d)}>הזמנה</button>
                                <button className={style.secondaryBtn} onClick={() => setSelectedDiagnoser(d)}>פרטים</button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedDiagnoser && (
                    <div className={styleDetails.detailsPopupBackdrop}>
                        <div className={styleDetails.detailsPopupBox}>
                            <h3>פרטי המאבחנת</h3>
                            <p><strong>:שם </strong> {selectedDiagnoser.name}</p>
                            <p><strong>:מייל </strong> {selectedDiagnoser.mail}</p>
                            <p><strong>:טלפון</strong> {selectedDiagnoser.phone}</p>
                            <button className={styleDetails.confirmBtn} onClick={() => setSelectedDiagnoser(null)}>סגור</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkshopDiagnosersModal;