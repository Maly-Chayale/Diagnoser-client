import React, { useEffect } from "react";
import styles from "./ProfileCustomer.module.css";
import { useSelector, useDispatch } from "react-redux";
// import { TypeDescription } from "./ProfileSlice"; // נתיב לפי הפרויקט שלך
import { TypeGroups } from "../TypeGroup/TypeGroupSlice"; // נתיב לפי הפרויקט שלך
// import { fetchTypeGroups } from '../TypeGroup/TypeGroupSlice';

const ProfileCustomer = () => {
  const dispatch = useDispatch();
  const customer = useSelector(state => state.LogIn.thisUser);
  const typeGroups = useSelector(s => s.TypeGroup.groups);
  const status = useSelector(s => s.TypeGroup.statusType);

  useEffect(() => {
    const load = async () => {
      try {
        if (status === "faild" || status === "")
          await dispatch(TypeGroups()).unwrap();
      }
      catch (err) {
        console.error("InitCustomer ERROR:", err);
      }
    }
    load()
  }, [status, dispatch]);

  if (status !== "succesfull") return <>טוען נתונים...</>

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.title}>
          פרופיל לקוח
        </div>

        <div className={styles.row}>
          <span className={styles.label}>שם</span>
          <span className={styles.value}>{customer.name}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>מייל</span>
          <span className={styles.value}>{customer.mail}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>טלפון</span>
          <span className={styles.value}>{customer.phone}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>סוג משתמש</span>
          <span className={styles.badge}>
            {typeGroups.find(t => t.code == customer.codeType)?.description}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProfileCustomer;