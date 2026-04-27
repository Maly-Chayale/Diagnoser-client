import { configureStore } from "@reduxjs/toolkit";
import DiagnoserSlice from "../features/Diagnosers/DiagnoserSlice"
import CustomerSlice from "../features/Customers/CustomerSlice"
import WorkshopSlice from "../features/WorkShop/WorkShopSlice";
import LogInSlice from "../features/SignIn/LogInSlice";
import ProfileSlice from "../features/Profile/ProfileSlice"
import ReferencesSlice from "../features/References/ReferencesSlice"
import TypeGroupSlice from "../features/TypeGroup/TypeGroupSlice"
import StatusSlice from "../features/Statuss/StatusSlice"

export const store = configureStore({
    reducer: {
        Diagnoser: DiagnoserSlice,
        Customer: CustomerSlice,
        WorkShop: WorkshopSlice,
        LogIn: LogInSlice,
        Profile: ProfileSlice,
        Reference: ReferencesSlice,
        TypeGroup: TypeGroupSlice,
        Status: StatusSlice
    }
});