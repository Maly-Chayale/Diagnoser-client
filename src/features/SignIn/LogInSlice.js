import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { ProfilelogIn } from "../Profile/ProfileSlice";

const initialState = {
    thisUser: null,
    statusUser: null
}

const headers = {
    'Content-Type': 'application/json'
}

export const addLead = createAsyncThunk("addLead",
    async (lead) => {
        await axios.post('https://localhost:7082/Leads/Add', lead,
            {
                headers: headers
            }).then(res => { })
        return lead
    })

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
            user.mail=user.mail.toLowerCase()
            const Customers = action.payload.Customers
            const Diagnosers = action.payload.Diagnosers
            const Leads = action.payload.Leads
            const customer = Customers.find(c => c.mail == user.mail && c.password == user.password)
            const lead = Leads.find(c => c.mail == user.mail && c.password == user.password)
            if (customer != null) {
                state.statusUser = "cust"
                state.thisUser=customer
            }
            else if (lead != null) {
                state.statusUser = "lead"
                state.thisUser=lead
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
            if (state.statusUser == null)
                state.statusUser="wrong"
        }
    },
    extraReducers: (builder) => {
    }
})

export const { signIn, logIn, UpdateUser } = LogInSlice.actions;
export default LogInSlice.reducer;