import { FaClock, FaHeart, FaRegHeart, FaTwitter } from "react-icons/fa"
import { FaRegUser, FaUser } from 'react-icons/fa6'
import { IoFastFoodOutline } from 'react-icons/io5'
import { PiCookingPot } from 'react-icons/pi'
import { SiLevelsdotfyi } from 'react-icons/si';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';



function Details() {
    const params = useParams();


    const recipies = useSelector((state) => state.recipies.recipies);//מערך המתכונים
    const [recepy,setResepy]=useState({})


     useEffect(() => {
        var id=params.id
         var r =  recipies.find(r=> r.id == id )
        setResepy(r);
    }, [recipies])

    return <>
        <h1>  </h1>
        <div className="details">
            <div key={recepy.id} className="reciepy" >
                <h1> {recepy.name}?</h1>
                <p>{recepy.desc}</p>
                  <div className='DetailsReciepy'>
                    <div className="details">
                        <p> {recepy.numOfproducts} מצרכים  <IoFastFoodOutline /></p>
                        <p> {recepy.time}   <FaClock /></p>
                        <p> ?{recepy.level} <SiLevelsdotfyi /></p>
                    </div>
                </div>

                <p id="style">הרכיבים:</p>
                <p >{recepy.ingredients}</p>
                
                <p id="style">הוראות הכנה</p>
                <p>{recepy.instructions}</p>

         


                
            </div>
        </div>


    </>
}
export default Details;