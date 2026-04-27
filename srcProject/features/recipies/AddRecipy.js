import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addRecipy } from './recipiesSlice';

import axios from 'axios';


const AddRecipy = () => {
    const dispath = useDispatch();
    const currentUser = useSelector(state => state.users.loggedInUser);
    const [recipy, setResipy] = useState({
        id: 1,
        name: "",
        desc: "",
        level: "",
        time: "",
        category: "",
        ingredients: [],
        instructions: "",
        img: "pizza.jpg",
        userId: currentUser.id,
        author: ""
    });
    const [ingredientValue, setIngredientValue] = useState("")
    const [ingredients, setIngredients] = useState([]);

    const onInputChange = (name, value) => {
        const oldRecipy = { ...recipy };
        oldRecipy[name] = typeof (value) === Number ? Number(value) : value;
        setResipy(oldRecipy);
    }
    const addIngredient = () => {
        const modifiedIngredients = [...ingredients];
        modifiedIngredients.push(ingredientValue);
        setIngredients(modifiedIngredients);
    }
    const saveRecipy = () => {
        if (currentUser === null) {
            alert(" מצטערים כרגע לא ניתן להוסיף מתכונים לאתר ");
            return;
        }
        const newRecipy = { ...recipy };
        axios.post("http://localhost:8000/add-recipies", newRecipy).then(res => {
            // const newRecipy = { ...recipy };
            newRecipy.id = res.data.insertedId;
            newRecipy.userId = currentUser.id;
            newRecipy.author = currentUser.username;
            newRecipy.ingredients = ingredients;
            dispath(addRecipy(newRecipy));
        })
        //    const newRecipy = { ...recipy };
        // newRecipy.userId = currentUser.id;
        // newRecipy.author = currentUser.username;
        // newRecipy.ingredients = ingredients;
        // dispath(addRecipy(recipy));



    }

    return (
        <div >
            <form className='addRecipyForm'>
                <h1>הוספת מתכון חדש</h1>
                <label>שם המתכון </label>
                <input type="text" name="name" onChange={(e) => { onInputChange(e.target.name, e.target.value) }} />
                <label>כמה מילים על המתכון  </label>
                <input type="text" name="desc" onChange={(e) => { onInputChange(e.target.name, e.target.value) }} />
                <label>קטגוריה </label>
                <input type="text" name="category" placeholder='מאפים / קינוחים / מנה ראשונה' onChange={(e) => { onInputChange(e.target.name, e.target.value) }} />
                <label>מרכיבים </label>
                <div id="addIngredientForm">
                    <input type='text' name="ingredient" placeholder='דוגמא: 2 כוסות קמח....' onChange={e => setIngredientValue(e.target.value)} />

                    <button type="button" onClick={() => addIngredient()}>הוספת רכיב <FaPlus /></button>
                </div>
                <ul >
                    {ingredients.length === null ? "הכנס רכיבי מתכון" : ingredients.map(ing => <li>{ing}</li>)}
                </ul>
                <label>זמן הכנה </label>
                <input type="text" name="time" onChange={(e) => { onInputChange(e.target.name, e.target.value) }} />
                <label>רמת קושי </label>
                <input type="text" name="level" placeholder='קל / בינוני / קשה' onChange={(e) => { onInputChange(e.target.name, e.target.value) }} />
                <label>אופן  ההכנה </label>
                <textarea name="instructions" placeholder='הקלידי את ההנחיות כאן...' />
                <button type="button" onClick={() => { saveRecipy(); }}>הוסף מתכון </button>
            </form>
        </div>
    )
}

export default AddRecipy