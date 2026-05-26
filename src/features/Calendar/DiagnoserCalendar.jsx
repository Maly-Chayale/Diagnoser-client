import React, { useDebugValue, useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import heLocale from "@fullcalendar/core/locales/he";
import { useDispatch, useSelector } from "react-redux";
import { HDate } from "hebcal";
import styles from "./DiagnoserCalendar.module.css";
import { InitWorkShops } from "../WorkShop/WorkShopSlice";
import { InitReferences } from "../References/ReferencesSlice";
import BookingPopupDetails from "../References/BookingPopupDetails";
import { InitDiagnoser } from "../Diagnosers/DiagnoserSlice";
import { InitCustomer } from "../Customers/CustomerSlice";



/** Hebcal date formatter */
const getHebrewDate = (date = new Date()) => {
    const hdate = new HDate(date);

    const day = hdate.getDate();
    const month = hdate.getMonthName("h");
    const year = hdate.getFullYear();

    return `${day} ב${month} ${year}`;
};

const hebrewFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
    day: "numeric",
    month: "long"
});

const DiagnoserCalendar = () => {

    const dispatch = useDispatch()

    const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
    const statusD = useSelector(state => state.Diagnoser.status);
    const references = useSelector(s => s.Reference.references);
    const statusR = useSelector(state => state.Reference.status);
    const workshops = useSelector(s => s.WorkShop.WorkShops);
    const statusW = useSelector(s => s.WorkShop.status);
    const customers = useSelector(state => state.Customer.Customers);
    const statusC = useSelector(state => state.Customer.status);
    const user = useSelector(s => s.LogIn.thisUser);

    const [activeBookingDetails, setActiveBookingDetails] = useState(null);

    const todayHebrewDate = useMemo(() => getHebrewDate(new Date()), []);

    useEffect(() => {
        const load = async () => {
            try {
                if (statusC === "faild" || statusC === "")
                    await dispatch(InitCustomer()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusC, dispatch]);

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
                if (statusR === "faild" || !statusR)
                    await dispatch(InitReferences()).unwrap();
            }
            catch (err) {
                console.error("InitCustomer ERROR:", err);
            }
        }
        load()
    }, [statusR, dispatch]);


    const workshopsById = useMemo(() => {
        const map = new Map();
        workshops?.forEach(w => {
            map.set(w.code, w);
        });
        return map;
    }, [workshops]);

    const customersById = useMemo(() => {
        const map = new Map();
        customers?.forEach(c => {
            map.set(c.code, c);
        });
        return map;
    }, [customers]);

    const filteredReferences = useMemo(() => {

        if (!references) return [];

        if (!user?.code) return references;

        return references.filter(r => {

            const workshop = workshopsById.get(r.codeWorkshop);

            if (!workshop) return false;

            return String(workshop.codeDiagnoser) === String(user.code);

        });

    }, [references, workshopsById, user?.code]);

    const formatTime = (time) => {

        if (typeof time === "string" && time.includes(":")) {
            return time.slice(0, 5);
        }

        const hour = Math.floor(time);
        const minute = Math.round((time - hour) * 60);

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    };

    const events = useMemo(() => {

        if (!filteredReferences) return [];

        return filteredReferences
            .map(r => {

                if (!r.date || r.time == null) return null;

                const time = formatTime(r.time);

                const [year, month, day] = r.date.split("-");
                const [hour, minute] = time.split(":");

                const start = new Date(
                    year,
                    month - 1,
                    day,
                    hour,
                    minute
                );

                if (isNaN(start.getTime())) return null;

                const cust = customersById.get(r.codeCustomer);


                return {
                    id: String(r.code),

                    title: "הזמנה",

                    start,

                    end: new Date(start.getTime() + 60 * 60 * 1000),

                    className: `status-${r.status}`,

                    extendedProps: {
                        status: r.status,
                        adress: r.adress,
                        time: r.time,
                        cust: cust?.name || "",
                        customer: cust,
                        reference: r,
                        code: r.code
                    }

                };

            })
            .filter(Boolean);

    }, [filteredReferences, customersById]);

    if (statusR !== "succesfull" || statusD !== "succesfull" || statusW !== "succesfull" || statusC !== "succesfull") return <>טוען נתונים...</>


    return (

        <div className={styles.calendarWrapper}>

            <FullCalendar

                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ]}

                locale={heLocale}

                direction="rtl"

                initialView="dayGridMonth"

                firstDay={0}

                height="85vh"
                events={events}

                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "hebrewDate dayGridMonth,timeGridWeek,timeGridDay"
                }}

                buttonText={{
                    today: "היום",
                    month: "חודש",
                    week: "שבוע נוכחי",
                    day: " יום נוכחי"
                }}

                customButtons={{
                    hebrewDate: {
                        text: todayHebrewDate
                    }
                }}

                eventContent={(arg) => {

                    const date = arg.event.start;

                    const hebrewDate = hebrewFormatter.format(date);

                    const customer = arg.event.extendedProps.customer;

                    const reference = arg.event.extendedProps.reference;

                    const time = date?.toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                    return (

                        <div className={styles.eventBox}>

                            <div className={styles.eventTitle}>
                                הזמנה #{reference?.code || ""}
                            </div>

                            <div className={styles.eventRow}>
                                <span className={styles.fieldLabel}>לקוח:</span>
                                <span className={styles.fieldValue}>{customer?.name || ""}</span>
                            </div>

                            <div className={styles.eventRow}>
                                <span className={styles.fieldLabel}>שעה:</span>
                                <span className={styles.fieldValue}>
                                    {arg.event.start?.toLocaleTimeString("he-IL", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>

                                <span className={styles.fieldSeparator}>|</span>

                                <span className={styles.fieldLabel}>כתובת:</span>
                                <span className={styles.fieldValue}>
                                    {reference?.adress || ""}
                                </span>
                            </div>

                            <button
                                className={styles.infoButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveBookingDetails({
                                        ...reference,
                                        start: arg.event.start,
                                        end: arg.event.end,
                                        title: arg.event.title
                                    });
                                }}
                            >
                                פרטי הזמנה
                            </button>

                        </div>
                    );
                }}
            />

            <BookingPopupDetails
                booking={activeBookingDetails}
                handleCancel={() => setActiveBookingDetails(null)}
                getDiagnoser={(codeWorkshop) => {

                    const workshop = workshops.find(w => w.code === codeWorkshop);

                    if (!workshop) return null;

                    return diagnosers.find(
                        d => d.code === workshop.codeDiagnoser
                    );
                }}
                customer={(codeCustomer) =>
                    customers.find(c => c.code === codeCustomer)
                }
            />

        </div>



    );
};

export default DiagnoserCalendar;