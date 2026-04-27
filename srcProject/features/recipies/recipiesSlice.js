import { createSlice } from "@reduxjs/toolkit";





const initialState = {
 recipies:[
    //   {
    //     id:1,
    //     name:"עוגת קפה מדהימה",
    //     desc:"עוגה קלילה ומהירה..... לכם ישאר רק להנות",
    //     level:"קל",
    //     time:"25 דקות",
    //     category:"עוגות",
    //     ingredients:[
    //         "3 כוסות קמח",
    //         "1 כוס סוכר",
    //         "2 ביצים",
    //         "1 כפית קפה"
    //     ],
    //     instructions:"ערבבי את הבלילה.  \n הכניסי לתנור \n אפי 20 דקות בחום של 180 מעלות",
    //     img:"p2.jpg",
    //     userId:1,
    //     author:"משה לוי"
    //   },
//       {
//         id:2,
//         name:"עוגת שוקולד טעימה",
//         desc:"עוגה קלילה ומהירה..... לכם ישאר רק ללק את האצבעות",
//         level:"קשה",
//         time:"40 דקות",
//         category:"עוגות",
//         ingredients:[
//             "3 כוסות קמח",
//             "1 כוס סוכר",
//             "1 חבילת שוקולד"
//         ],
//         instructions:"ערבבי את הבלילה.  \n הכניסי לתנור \n אפי 20 דקות בחום של 200 מעלות",
//         img:"p3.jpg",
//         userId:1,
//         author:"משה לוי"
//       }
 ]

}

const recipiesSlice = createSlice({
    name: "recipies",
    initialState,
    reducers: {

        addRecipy: (state, action)=>{
            const recipyObj = action.payload;
            state.recipies.push(recipyObj);
        },
        RecipiesArivvedFromServer:(state, action) => {
           const req = action.payload;
           state.recipies = req;
        }
    }



})

export const { addRecipy, RecipiesArivvedFromServer } = recipiesSlice.actions;
export default recipiesSlice.reducer;