import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import heLocale from "@fullcalendar/core/locales/he";

import { useSelector } from "react-redux";

import { HDate } from "hebcal";

import styles from "./DiagnoserCalendar.module.css";

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

    const references = useSelector(s => s.Reference.references);
    const workshops = useSelector(s => s.WorkShop.WorkShops);
    const user = useSelector(s => s.LogIn.thisUser);
    const customers = useSelector(state => state.Customer.Customers);

    const todayHebrewDate = useMemo(() => getHebrewDate(new Date()), []);

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
                        cust: cust?.name || ""
                    }
                };

            })
            .filter(Boolean);

    }, [filteredReferences, customersById]);

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

                    return (

                        <div className={styles.eventBox}>

                            <div className={styles.eventTitle}>
                                {arg.event.title}
                            </div>

                            <div className={styles.eventHebrewDate}>
                                לקוח : {arg.event.extendedProps.cust}
                            </div>

                            <div className={styles.eventHebrewDate}>
                                תאריך : {hebrewDate}
                            </div>

                            <div className={styles.eventHebrewDate}>
                                כתובת : {arg.event.extendedProps.adress}
                            </div>

                        </div>
                    );
                }}
            />

        </div>
    );
};

export default DiagnoserCalendar;