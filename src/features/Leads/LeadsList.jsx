import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitLeads } from './LeadsSlice';
// import style from './LeadsList.module.css';
import style from '../Customers/CustomersList.module.css';

const LeadsList = () => {
  const dispatch = useDispatch();
  const leads = useSelector(state => state.Lead.Leads);
  const status = useSelector(state => state.Lead.status);

  const [search, setSearch] = useState("");

  const string = (s) => `${s.name} ${s.mail} ${s.phone}`;

  const filteredLeads = useMemo(() =>
    leads?.filter(s => string(s).toLowerCase().includes(search.toLowerCase())),
    [leads, search]
  );

  useEffect(() => {
    if (status !== "loaded") dispatch(InitLeads());
  }, [status, dispatch]);

  return (
    <div className={style.leadsPage}>
      <div className={style.searchRow}>
        <input
          type="text"
          className={style.searchInput}
          placeholder="חיפוש לפי שם, אימייל או טלפון..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={style.grid}>
        {filteredLeads?.map((lead, index) => (
          <div className={style.card} key={lead.id || index}>
            <h2 className={style.name}>{lead.name}</h2>
            <div className={style.badges}>
              <span className={style.badge}>📧 {lead.mail}</span>
              <span className={style.badge}>📞 {lead.phone}</span>
            </div>
            <p className={style.description}>לקוח מרוצה ומעודכן.</p>
            <button className={style.actionBtn}>הצג הזמנות</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsList;