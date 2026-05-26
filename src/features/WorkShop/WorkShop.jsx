import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitWorkShops } from './WorkShopSlice';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import AppointmentCard from './AppointmentCard';
import AddWorkshopModal from './AddWorkshopModal';
import style from './Workshop.module.css';

function Workshop() {

    const dispatch = useDispatch();

    const workshops = useSelector(s => s.WorkShop.WorkShops);
    const statusW = useSelector(s => s.WorkShop.status);

    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)
    const statusD = useSelector(state => state.Diagnoser.status)

    const statusUser = useSelector(s => s.LogIn.statusUser);

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusW === "faild" || statusW === "")
                    await dispatch(InitWorkShops()).unwrap();
            }
            catch (err) {
                console.error(err);
            }
        }
        load()
    }, [statusW, dispatch]);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusD === "faild" || statusD === "")
                    await dispatch(InitDiagnoser()).unwrap();
            }
            catch (err) {
                console.error(err);
            }
        }
        load()
    }, [statusD, dispatch]);

    const filtered = useMemo(() =>
        workshops.filter(w =>
            JSON.stringify(w).toLowerCase().includes(search.toLowerCase())
        ),
        [workshops, search]
    );

    const getDiagnoser = (coded) =>
        diagnosers.find(d => d.code === coded);

    if (statusW !== "succesfull" || statusD !== "succesfull")
        return <>טוען נתונים...</>

    return (
        <div className={style.page}>

            <div className={style.searchRow}>
                <input
                    className={style.searchInput}
                    placeholder="חיפוש..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className={style.grid}>
                {
                    filtered
                        .filter(w => getDiagnoser(w.codeDiagnoser)?.available)
                        .map(w => (
                            <AppointmentCard
                                key={w.code}
                                WorkShop={w}
                            />
                        ))
                }
            </div>

            {/* כפתור צף */}
            {statusUser !== "cust" && (
                <div className={style.floatingAction}>
                    <button
                        className={style.floatingBtn}
                        onClick={() => setOpen(true)}
                    >
                        ➕ הוספת סדנה
                    </button>
                </div>
            )}

            <AddWorkshopModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}

export default Workshop;