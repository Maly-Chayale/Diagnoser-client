// import { createSlice } from "@reduxjs/toolkit";
// import { GrFavorite } from "react-icons/gr";
import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    users:
        [
            {
                id: 1,
                username: "משה לוי",
                email: "m@gmail.com",
                password: "1234",
                favoriets: [1]
            },
            {
                id: 2,
                username: "חיים לוי",
                email: "ch@gmail.com",
                password: "1111",
                favoriets:[1,2]
            }
        ],
        loggedInUser:null
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        
        onUserLoggedIn: (state, action)=>{
            const user = action.payload;
            state.loggedInUser  = user;
        },
        onUserRegister: (state, action)=>{
          const newUser = action.payload;
          state.users.push(newUser);
          state.loggedInUser = newUser; 
        },
          addFavoriteRecipies: (state, action)=>{
            const recipyId = action.payload;
            console.log(action);
            //alert(action.payload+"rdyftur7");
                  const index = state.users.findIndex(u=>u.id === state.loggedInUser.id);
                   state.users[index].favoriets=[... state.users[index].favoriets,recipyId];
                   state.loggedInUser.favoriets=[...state.loggedInUser.favoriets,recipyId];
                   console.log(state.users[index].favoriets);
                   //.push(recipyId);
            
        },
        onUserLoggedOut: (state)=>{
          state.loggedInUser = null;
        }
    }
})

export const { onUserLoggedIn, onUserRegister, addFavoriteRecipies, onUserLoggedOut } = userSlice.actions;
export default userSlice.reducer;