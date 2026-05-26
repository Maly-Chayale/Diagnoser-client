import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import style from './DiagnoserDetails.module.css';
import { InitDiagnoser } from './DiagnoserSlice';

const DiagnoserDetails = () => {

    const dispatch = useDispatch()

    const diagnosers = useSelector((state) => state.Diagnoser.Diagnosers);
    const status = useSelector((state) => state.Diagnoser.status);
    const { code } = useParams();
    const d = diagnosers.find(d => d.code == code);

    useEffect(() => {
        const load = async () => {
            try {
                if (status === "faild" || status === "")
                    await dispatch(InitDiagnoser()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [status, dispatch]);

    if (!d) {
        return <div className={style['details-page']}>לא נמצאה מאבחנת עם הקוד הזה.</div>;
    }

  if (status !== "succesfull") return <>טוען נתונים...</>

    return (
        <div className={style['details-page']}>
            <div className={style['cards-grid']}>
                <div key={d.mail} className={style.card}>
                    <div className={style['card-header']}>
                        <h2 className={style.name}>{d.name}</h2>
                        {d.morphology && <span className={`${style.badge} ${style.morphology}`}>🧠 מורפולוגיה</span>}
                        {d.chirology && <span className={`${style.badge} ${style.chirology}`}>✋ כירולוגיה</span>}
                        {d.graphology && <span className={`${style.badge} ${style.graphology}`}>✍️ גרפולוגיה</span>}
                    </div>

                    <p className={style.description}>📧 {d.mail}</p>
                    <p className={style.description}>📞 {d.phone}</p>

                    <span className={`${style.badge} ${d.available ? style['status-available'] : style['status-unavailable']}`}>
                        {d.available ? 'זמינה' : 'לא זמינה כרגע'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DiagnoserDetails;