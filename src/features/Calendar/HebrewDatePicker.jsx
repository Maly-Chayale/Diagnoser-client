import React, { useState, useEffect } from "react";
import styles from "./HebrewDatePicker.module.css";
import { HDate } from "hebcal";

// פונקציות עזר
function toHebrewNumber(num) {
  const heb = [
    '', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
    'י', 'י״א', 'י״ב', 'י״ג', 'י״ד', 'ט״ו', 'ט״ז',
    'י״ז', 'י״ח', 'י״ט', 'כ', 'כ״א', 'כ״ב', 'כ״ג', 'כ״ד',
    'כ״ה', 'כ״ו', 'כ״ז', 'כ״ח', 'כ״ט', 'ל'
  ];
  return heb[num] || num;
}

function translateHebrewMonth(monthName) {
  const key = monthName.trim().toLowerCase();
  const months = {
    "nisan": "ניסן",
    "iyyar": "אייר",
    "sivan": "סיוון",
    "tamuz": "תמוז",
    "av": "אב",
    "elul": "אלול",
    "tishrei": "תשרי",
    "cheshvan": "חשון",
    "kislev": "כסלו",
    "tevet": "טבת",
    "shevat": "שבט",
    "adar": "אדר",
    "adar i": "אדר א׳",
    "adar ii": "אדר ב׳",
    "adar 1": "אדר א׳",
    "adar 2": "אדר ב׳",
    "adar rishon": "אדר א׳",
    "adar sheni": "אדר ב׳"
  };
  return months[key] || monthName;
}

function HebrewDatePicker({ value, onChange }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(value || null);

const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  for (let i = 0; i < startDayOfWeek; i++) daysArray.push(null);

  for (let day = 1; day <= totalDays; day++) {
    const gregDate = new Date(year, month, day);
    const hDate = new HDate(gregDate);

    const dayHeb = `${toHebrewNumber(hDate.getDate())} ${translateHebrewMonth(hDate.getMonthName())}`;
    const dayGreg = `${gregDate.getDate()} ${gregDate.toLocaleString("he-IL", { month: 'long' })}`;

    const pad = (n) => n.toString().padStart(2, '0');
    const csharpDate = `${gregDate.getFullYear()}-${pad(gregDate.getMonth()+1)}-${pad(gregDate.getDate())}`;

    daysArray.push({
      heb: dayHeb,
      greg: dayGreg,
      iso: csharpDate
    });
  }

  return daysArray;
};

  useEffect(() => {
    setCalendarDays(generateCalendar(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  const weekDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const handleDateClick = (dayObj) => {
    if (!dayObj) return;
    setSelectedDate(dayObj);
    onChange(dayObj);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const hebMonth = translateHebrewMonth(new HDate(new Date(currentYear, currentMonth, 1)).getMonthName());
  const gregMonth = new Date(currentYear, currentMonth, 1).toLocaleString("he-IL", { month: "long" });

  return (
    <div className={styles.datePicker}>
      <div className={styles.navigation}>
        <div className={styles.monthRow}>
          <button onClick={handlePrevMonth}>{"<"}</button>
          <span>{`${gregMonth} / ${hebMonth}`}</span>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {calendarDays.map((dayObj, index) => {
          if (!dayObj) return <div key={index} />;

          const gregDateObj = new Date(currentYear, currentMonth, index + 1 - calendarDays.filter(d => d === null).length);
          const dayOfWeek = gregDateObj?.getDay(); // 0 = ראשון, 6 = שבת
          const isShabbat = dayOfWeek === 6;

          const isToday = dayObj.greg === `${today.getDate()} ${today.toLocaleString("he-IL", { month: 'long' })}`;
          const isSelected = selectedDate?.heb === dayObj.heb;

          return (
            <div
              key={index}
              className={`${styles.dateBox} ${isSelected ? styles.selected : ""} ${isShabbat ? styles.shabbat : ""}`}
              style={{
                backgroundColor: isToday ? "green" : undefined,
                color: isToday ? "white" : undefined
              }}
              onClick={() => handleDateClick(dayObj)}
            >
              <div className={styles.heb}>{dayObj.heb}</div>
              <div className={styles.greg}>{dayObj.greg}</div>
              {isShabbat && <div className={styles.shabbatIcon}>🕯️🕯️</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HebrewDatePicker;