import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Recipy from '../recipies/Recipy';
import { useDispatch, useSelector } from 'react-redux';





const UserProfile = () => {
  const user = useSelector(state => state.users.loggedInUser);
  const recipies = useSelector(state => state.recipies.recipies);
  const navigate = useNavigate();


  const [userRecipies, setuserRecipies] = useState([]);
  const [favoriteRecipies, setFavoriteRecipies] = useState([]);
  useEffect(() => {
    if (user == null) {
      navigate("./Login")
    }
  })
  useEffect(() => {
      const fRecipies = [];

    for (let i = 0; i < user.favoriets?.length; i++) {
      const re = recipies.find(r => r.id == user.favoriets[i]);
      fRecipies.push(re);
    }

    const uRecipies = recipies?.filter(r => r.userId == user.id);

    setFavoriteRecipies(fRecipies);
    setuserRecipies(uRecipies);
  }, [])

  return (
    <div>

      <h1> שלום {user?.username}</h1>
      <hr />
      <h2>המתכונים שיצרת</h2>
      <div style={{ display: 'flex' }}>
        {userRecipies.map(r => <Recipy
          author={r.author}
          name={r.name}
          img={r.img}
          level={r.level}
          time={r.time}
          numOfproducts={r.ingredients.length} />)}
      </div>
      <h2>המתכונים שאהבת</h2>
      <div style={{ display: 'flex' }}>
        {favoriteRecipies.map(r => <Recipy
          author={r.author}
          name={r.name}
          img={r.img}
          level={r.level}
          time={r.time}
          numOfproducts={r.ingredients.length} />)}
      </div>
      <hr />
    </div>
  )
}

export default UserProfile