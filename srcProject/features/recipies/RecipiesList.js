import React, { useEffect, useState } from 'react'
import Recipy from './Recipy'
import { useSelector } from 'react-redux'



const RecipiesList = () => {

    const recipies = useSelector((state)=>state.recipies.recipies);//מערך המתכונים
    const [filtreRecipies, setFiltreRecipies] = useState([]);

  useEffect(()=>{
    setFiltreRecipies(recipies);
  console.log(recipies,"nnnnnn");
  
},[recipies])

   const filterRecipies=(searchTxt)=>{
    const newArr = recipies.filter(r=>r.name.includes(searchTxt));
    setFiltreRecipies(newArr);
   }
   

    return (
        <div>
            <h1>נבחרת המתכונים שלנו</h1>
            <div id="search">
                <input  placeholder={"הקלד את מה שאתה רוצה לחפש..."} onChange={(e)=>
                    {filterRecipies(e.target.value)}}/>
            </div>
            <div className='recipiesList'>
             
               
                {/* {recipies.map(r=><p key={r.id}>{r.name}</p>)} */}
                {filtreRecipies.map(r=>  <Recipy 
                id = {r.id}
                author={r.author}
                name={r.name}
                img={r.img}
                level={r.level}
                time={r.time}
                numOfproducts={r.ingredients.length}
                desc={r.desc}
                category={r.category}
                ingredients={r.ingredients}
                instructions={r.instructions}
 
                />)}

            </div>
        </div>
    )
}

export default RecipiesList