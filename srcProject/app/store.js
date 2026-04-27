import { configureStore } from "@reduxjs/toolkit";
import recipiesReduser from '../features/recipies/recipiesSlice'
// import userReduser from '../features/users/userSlice'
import userReduser from '../features/users/usersSlice'

export const store = configureStore({
    reducer:{
      recipies:recipiesReduser,
      users:userReduser
    }
});
