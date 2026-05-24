import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import heLocale from "@fullcalendar/core/locales/he";

import { useSelector, useDispatch } from "react-redux";
import { updateReference } from "../References/ReferencesSlice";

import styles from "./DiagnoserCalendar.module.css";

const DiagnoserCalendar = () => {
    const dispatch = useDispatch();

    const references = useSelector(s => s.Reference.references);
    const workshops = useSelector(s => s.WorkShop.WorkShops);
    const customers = useSelector(s => s.Customer.Customers);

    const user = useSelector(s => s.LogIn.thisUser);
    const statusUser = useSelector(s => s.LogIn.statusUser);

    const getWorkshop = code => workshops.find(w => w.code === code);
    const getCustomer = code => customers.find(c => c.code === code);

    // ⭐ EVENTS
    const events = useMemo(() => {
        if (!references) return [];

        return references
            .filter(r => {
                if (r.status === 1) return false;

                const w = getWorkshop(r.codeWorkshop);
                if (!w) return false;

                if (statusUser !== "Esty") {
                    return w.codeDiagnoser === user.code;
                }

                return true;
            })
            .map(r => {
                const workshop = getWorkshop(r.codeWorkshop);
                const customer = getCustomer(r.codeCustomer);

                const start = new Date(`${r.date}T${String(r.time || 10).padStart(2, "0")}:00:00`);

                const end = new Date(start);
                end.setHours(end.getHours() + 2);

                return {
                    id: r.code,

                    title: customer?.name || "לקוח",

                    start,
                    end,

                    extendedProps: {
                        workshopCode: r.codeWorkshop,
                        customer: customer?.name,
                        address: r.adress,
                        comments: r.comments,
                        status: r.status
                    },

                    backgroundColor:
                        r.status === 3 ? "#f44336" :
                        r.status === 2 ? "#4caf50" :
                        "#ff9800",

                    borderColor: "#222"
                };
            });
    }, [references, workshops, customers, user, statusUser]);

    // ⭐ לחיצה על אירוע
    const handleEventClick = (info) => {
        const e = info.event;
        alert(
            `לקוח: ${e.extendedProps.customer}
כתובת: ${e.extendedProps.address}
הערות: ${e.extendedProps.comments}`
        );
    };

    // ⭐ גרירת אירוע (הופך את זה למערכת אמיתית!)
    const handleEventDrop = async (info) => {
        const updated = {
            code: Number(info.event.id),
            date: info.event.start.toISOString().split("T")[0],
            time: info.event.start.getHours()
        };

        await dispatch(updateReference(updated));
    };

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

                initialView="timeGridWeek"
                height="85vh"

                events={events}

                eventClick={handleEventClick}
                eventDrop={handleEventDrop}

                editable={true}
                selectable={true

                }

                slotMinTime="08:00:00"
                slotMaxTime="22:00:00"

                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}

                buttonText={{
                    today: "היום",
                    month: "חודש",
                    week: "שבוע",
                    day: "יום"
                }}
            />
        </div>
    );
};

export default DiagnoserCalendar;