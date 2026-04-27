import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';

function WorkshopDetails() {

    const workshops = useSelector(state => state.WorkShop.WorkShops)
    const { code } = useParams()
    const w = workshops.find(d => d.code == code)

    return (
        <>
            <AppointmentCard key={w.code} WorkShop={w} />
        </>
    );
}

export default WorkshopDetails;
