import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DiagnoserDetails = () => {

    const diagnosers = useSelector((state) => state.Diagnoser.Diagnosers)
    const { code } = useParams()
    const d = diagnosers.find(d=>d.code==code)

    return (
        <div className="cards-grid">
            {/* <h1 className="title">דף אישי מאבחנת {d.name}</h1> */}
            <div key={d.mail} className="card">
                <div className="card-header">
                    <h2 className="name">{d.name}</h2>
                    {d.morphology && <span className="badge">מורפולוגית</span>}
                    <br></br>
                    {d.chorology && <span className="badge">כירולוגיה</span>}
                    <br></br>
                    {d.graphology && <span className="badge">גרפולוגית</span>}
                </div>
                <p className="description">צרו קשר:</p>
                <p className="description">{d.mail}</p>
                <p className="description">{d.phone}</p>
                {d.available ? <span className="badge">זמינה</span> :
                    <span className="badge">לא זמינה כרגע</span>}
            </div>
        </div>
    )
}
export default DiagnoserDetails;