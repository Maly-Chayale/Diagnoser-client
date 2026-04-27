import React from 'react'
import { FaBook, FaUser } from 'react-icons/fa'
import { LuChefHat } from 'react-icons/lu'



const Home = () => {
    return (
        <div className='home'>
            <h1>אתר המתכונים הפופולארי בישראל</h1>
            <div className="info">
                <p>37000 משתמשים מחוברים
                    <FaUser fontSize={"5rem"}  color={"#bc1a1a"}/>
                </p>
                <p>1000 מתכונים
                    <FaBook fontSize={"5rem"}  color={"#bc1a1a"}/>
                </p>
                <p> שף 1
                    <LuChefHat fontSize={"5rem"}  color={"#bc1a1a"} />
                </p>
            </div>
        </div>
    )
}

export default Home