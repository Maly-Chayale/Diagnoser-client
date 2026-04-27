import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { ProfilelogIn } from "../Profile/ProfileSlice";

const initialState = {
    thisUser: null,
    statusUser: null
}

const LogInSlice = createSlice({
    name: "Customer",
    initialState,
    reducers: {
        signIn: (state, action) => {
            state.thisUser = action.payload
            state.statusUser = "cust"
        },
        UpdateUser:(state, action)=>{
            state.thisUser = action.payload
        },
        logIn: (state, action) => {
            let user = action.payload.user
            const Customers = action.payload.Customers
            const Diagnosers = action.payload.Diagnosers
            const customer = Customers.find(c => c.mail == user.mail && c.password == user.password)
            if (customer != null) {
                state.statusUser = "cust"
                state.thisUser=customer
            }
            else {
                const diagnoser = Diagnosers.find(c => c.mail == user.mail && c.password == user.password)
                if (diagnoser != null && diagnoser.mail == "22@2") {
                    state.statusUser = "Esty"
                    state.thisUser=diagnoser
                }
                else if (diagnoser != null) {
                    state.statusUser = "diagnoser"
                    state.thisUser=diagnoser
                }
            }
            // if (state.statusUser == null)
            //     return false
            // return true
        }
    },
    extraReducers: (builder) => {
    }
})

export const { signIn, logIn, UpdateUser } = LogInSlice.actions;
export default LogInSlice.reducer;