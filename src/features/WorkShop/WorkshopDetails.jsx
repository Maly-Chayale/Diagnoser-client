
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './WorkshopDetails.module.css';
import { useParams } from 'react-router-dom';
import { InitWorkShops } from './WorkShopSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import { TypeGroups } from '../TypeGroup/TypeGroupSlice';

function WorkshopDetails() {
    const { code } = useParams();
    const codeNumber = Number(code);
    const dispatch = useDispatch();

    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const statusW = useSelector(state => state.WorkShop.status);
    const statusD = useSelector(s => s.Diagnoser.status);
    const diagnosers = useSelector(s => s.Diagnoser.Diagnosers);
    const groups = useSelector(state => state.TypeGroup.groups);
    const statusType = useSelector(state => state.TypeGroup.statusType);

    const [workShop, setWorkShop] = useState(null);
    const [diagnoser, setDiagnoser] = useState(null);

    useEffect(() => {
        if (workshops) {
            const w = workshops.find(w => w.code === codeNumber);
            setWorkShop(w);
            if (diagnosers && w) {
                const d = diagnosers.find(d => d.code === w.codeDiagnoser);
                setDiagnoser(d);
            }
        }
    }, [dispatch, statusW, codeNumber, statusD]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusD === "faild" || statusD === "")
                    await dispatch(InitDiagnoser()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusD, dispatch]);

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

    const getType = (ws) => ws && groups
        ? groups.find(g => g.code === ws.code)?.description || ""
        : "";

    if (statusType !== "succesfull" || statusW !== "succesfull" || statusD !== "succesfull") return <>טוען נתונים...</>


    return (
        <div className={style.detailsPage}>
            {workShop ? (
                <div className={style.card}>
                    <h2 className={style.title}>{getType(workShop)}</h2>

                    <p className={style.diagnoserName}>{diagnoser?.name}</p>
                    <p className={style.description}>{workShop?.description}</p>

                    <div className={style.capabilities}>
                        {workShop?.morfology && (
                            <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>
                        )}
                        {workShop?.grafology && (
                            <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>
                        )}
                        {workShop?.chirology && (
                            <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>
                        )}
                    </div>

                    <div className={style.stats}>
                        <div className={style.statBox}>
                            <span className={style.statLabel}> :מחיר💰</span>
                            <span className={style.statValue}>₪{workShop?.price} </span>
                        </div>
                        <div className={style.statBox}>
                            <span className={style.statLabel}> :משתתפים👥</span>
                            <span className={style.statValue}>{workShop?.accontOfPeople}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <p className={style.notFound}>סדנה לא נמצאה</p>
            )}
        </div>
    );
}

export default WorkshopDetails;