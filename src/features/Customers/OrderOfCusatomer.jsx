import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { InitReferences } from '../References/ReferencesSlice';
import style from './OrderOfCusatomer.module.css';
import { TypeGroups } from '../TypeGroup/TypeGroupSlice';

const OrderOfCusatomer = () => {

    const dispatch = useDispatch();

    const references = useSelector(state => state.Reference.references);
    const status = useSelector(state => state.Reference.status);
    const customers = useSelector(state => state.Customer.Customers);
    const typeGroups = useSelector(s => s.TypeGroup.groups);
    const statusType = useSelector(s => s.TypeGroup.status);

    const { code } = useParams();

    const cust = customers.find(c => c.code == code);
    const type = typeGroups.find(t => t.code == cust?.codeType);

    useEffect(() => {

        const loading = async () => {
            if (!status)
                await dispatch(InitReferences());
        };

        loading();

    }, [status, dispatch]);

    useEffect(() => {
        if (statusType === "")
            dispatch(TypeGroups())
    }, [dispatch, statusType]);

    if (status === "" || status === "loading") {
        return <div className={style.loading}>טוען הזמנות...</div>;
    }

    if (status === "faild") {
        return <div className={style.error}>שגיאה בטעינת הזמנות</div>;
    }

    return (
        <div className={style.ordersPage}>

            <div className={style.header}>
                <h1 className={style.title}>
                    {cust?.mail} | הזמנות {cust?.name}
                </h1>
            </div>

            <div className={style.ordersContainer}>

                {references.filter(r => r.codeCustomer == code).length > 0 ? (

                    references
                        .filter(r => r.codeCustomer == code)
                        .map(item => (

                            <div key={item.code} className={style.card}>

                                {/* HEADERS */}
                                <div className={style.tableHeader}>

                                    <div className={style.cell}>
                                        <span className={style.label}>קוד הזמנה</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>תאריך</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>שעה</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>כתובת</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>קוד סדנא</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>סוג הסדנא</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span className={style.label}>הערות</span>
                                    </div>

                                </div>

                                {/* VALUES */}
                                <div className={style.tableRow}>

                                    <div className={style.cell}>
                                        <span>{item.code}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{item.date}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{item.time}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{item.adress}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{item.codeWorkshop}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{type?.description}</span>
                                    </div>

                                    <div className={style.cell}>
                                        <span>{item.comments}</span>
                                    </div>

                                </div>

                            </div>

                        ))

                ) : (

                    <div className={style.empty}>
                        לא נמצאו הזמנות ללקוח זה
                    </div>

                )}

            </div>
        </div>
    );
};

export default OrderOfCusatomer;