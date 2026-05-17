import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './WorkshopCard.module.css';
import { useParams } from 'react-router-dom';
import { InitWorkShops } from './WorkShopSlice';

function WorkshopDetails() {

    const params= useParams()
    const {code} = params

    const dispatch = useDispatch();

    const workshops = useSelector(state => state.WorkShop.WorkShops);
    const status = useSelector(state => state.WorkShop.Status);
    const groups = useSelector(state => state.TypeGroup.groups);
    const [WorkShop, setWorkShop] = useState()

    useEffect(() => {
        if (status === "") {
            dispatch(InitWorkShops());
        }
        if(workshops!=null)
        {
            const w = workshops.find(w=>w.code==code)
            setWorkShop(w)
        }
    }, [dispatch, status]);

    const getType = (code) => {
        return groups.find(g => g.code === code)?.description;
    };

    return (
        <>
            <div className={style.card}>

                <h2 className={style.title}>
                    {getType(WorkShop)}
                </h2>

                <div className={style.capabilities}>

                    {WorkShop?.morfology && (
                        <span className={`${style.badge} ${style.morphology}`}>
                            🧠 מורפולוגיה
                        </span>
                    )}

                    {WorkShop?.grafology && (
                        <span className={`${style.badge} ${style.graphology}`}>
                            ✍️ גרפולוגיה
                        </span>
                    )}

                    {WorkShop?.chirology && (
                        <span className={`${style.badge} ${style.chirology}`}>
                            ✋ כירולוגיה
                        </span>
                    )}

                </div>

                <p className={style.description}>
                    {WorkShop?.description}
                </p>

            </div>

         </>
    );
}

export default WorkshopDetails;