import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitCustomer } from './CustomerSlice';
import style from './CustomersList.module.css'
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const OrderOfCusatomer = () => {
    

    return (
        <div>הנה ההזמנה שלך</div>
    );
};

export default OrderOfCusatomer;