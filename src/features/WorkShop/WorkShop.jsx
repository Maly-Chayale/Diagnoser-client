import React, { useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
    InitWorkShops
} from './WorkShopSlice';

import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';

import { fetchTypeGroups, TypeGroups } from '../TypeGroup/TypeGroupSlice';

import AppointmentCard from './AppointmentCard';

import AddWorkshopModal from './AddWorkshopModal';

import style from './Workshop.module.css';
import WorkshopCard from './AppointmentCard';

function Workshop() {

    const dispatch = useDispatch();

    const workshops = useSelector(s => s.WorkShop.WorkShops);
    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers)

    const status = useSelector(s => s.WorkShop.status);

    const statusUser = useSelector(s => s.LogIn.statusUser);

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    useEffect(() => {

        if (status === "" || status === "faild") {

            dispatch(InitWorkShops());
        }

        dispatch(InitDiagnoser());

        dispatch(TypeGroups());

    }, [dispatch, status]);

    const filtered = useMemo(() =>
        workshops.filter(w =>
            JSON.stringify(w)
                .toLowerCase()
                .includes(search.toLowerCase())
        ),
        [workshops, search]
    );

        const getDiagnoser = (code) => diagnosers.find(d => d.code === code);


    if (status === "loading") return <div>טוען...</div>;

    if (status === "faild") return <div>שגיאה</div>;

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

            {
                statusUser !== "cust" &&
                statusUser !== "cust" && (

                    <button
                        className={style.addBtn}
                        onClick={() => setOpen(true)}
                    >
                        ➕ הוספת סדנא
                    </button>
                )
            }

            <div className={style.grid}>

                {
                    filtered.filter(w=>getDiagnoser(w.codeDiagnoser)?.available).map(w => (

                        <WorkshopCard
                            key={w.code}
                            WorkShop={w}
                        />
                    ))
                }

            </div>

            {<AddWorkshopModal
                open={open}
                onClose={() => setOpen(false)}
            />}

        </div>
    );
}

export default Workshop;