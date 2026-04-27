import React from 'react'
import { FaClock, FaHeart, FaRegHeart, FaTwitter } from "react-icons/fa"
import { FaRegUser, FaUser } from 'react-icons/fa6'
import { IoFastFoodOutline } from 'react-icons/io5'
import { PiCookingPot } from 'react-icons/pi'
import { SiLevelsdotfyi } from 'react-icons/si'
import { addFavoriteRecipy } from '../users/usersSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFavoriteRecipies } from '../users/usersSlice'


// import React from 'react'
// import { FaClock, FaHeart, FaRegHeart, FaTwitter } from "react-icons/fa"
// import { FaRegUser, FaUser } from 'react-icons/fa6'
// import { IoFastFoodOutline } from 'react-icons/io5'
// import { SiLevelsdotfyi } from 'react-icons/si';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { addFavoriteRecipies } from '../users/userSlice'


const Recipy = ({ id, author, name, img, level, time, numOfproducts, desc, category,ingredients, instructions }) => {

    const dispath = useDispatch();
    const user = useSelector((state) => state.users.loggedInUser);
    const favorites = useSelector(state => state.users.loggedInUser.favorites);
    const isFavorite = favorites?.find(r => r == id) ?? [];

    // const recipies = useSelector((state) => state.recipies.recipies);

    return (
        //id != -1 &&
        <div className='recipy'>

            <div className='recipiyHeader'>
                <p class="author">  <span><FaUser /></span>{author}</p>        
                <hr />
                <button type="button" onClick={() => {dispath(addFavoriteRecipies(id))}}><FaRegHeart /></button>
            </div>
            {/* <img src="/images/recipies/pizza.jpg" /> */}
            <img src={"/images/recipies/" + img} />

            <h1> {name}</h1>
            <div className="details">
                <p> {numOfproducts} מצרכים  <IoFastFoodOutline /></p>
                <p> {time}   <FaClock /></p>
                <p> {level} <SiLevelsdotfyi /></p>
            </div>

            <Link to={`/Details/${name}/${author}/${numOfproducts}/${time}/${level}/${desc}/${category}/${ingredients}/${instructions}`}>לפרטים</Link>
      


        </div>
    )
}

export default Recipy