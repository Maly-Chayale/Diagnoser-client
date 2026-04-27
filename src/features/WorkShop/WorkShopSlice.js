import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    WorkShops: [],
    Diagnosers: [],
    status: ""
}

const headers = {
    'Content-Type': 'application/json'
}

export const InitWorkShops = createAsyncThunk("InitWorkShops",
    async () => {
        let data
        await axios.get('https://localhost:7082/api/WorkShops/ReadAll').then(res => {
            data = res.data
        })
        return data
    })



export const GetWorkShop = createAsyncThunk("GetWorkShop",
    async (code) => {
        let data
        await axios.get('https://localhost:7082/api/WorkShops/Read/' + code
        ).then(res =>
            data = res.data
        )
        return data
    }
)

export const addWorkShop = createAsyncThunk("addWorkShop",
    async (WorkShop) => {
        await axios.post('https://localhost:7082/api/WorkShops/Add', WorkShop,
            {
                headers: headers
            }).then(res => { })
        return WorkShop
    })

export const deleteWorkShop = createAsyncThunk("deleteWorkShop",
    async (WorkShop) => {
        await axios.delete('https://localhost:7082/api/WorkShops/Delete', 
            {
                headers: headers,
                data:WorkShop
            }
        ).then(res => { })
        return WorkShop
    })

export const updateWorkShop = createAsyncThunk("updateWorkShop",
    async (WorkShop) => {
        await axios.put('https://localhost:7082/api/WorkShops/Update', WorkShop,
            {
                headers: headers
            }
        ).then(res => { })
        return WorkShop
    })


export const getType = createAsyncThunk('getType',
    async (workShop, { rejectWithValue }) => {
        try {
            const res = await axios.post('https://localhost:7082/api/WorkShops/Type', workShop, { headers });
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


// export const GetWorkShop = createAsyncThunk("GetWorkShop",
//     async (code) => {
//         let data
//         await axios.get('https://localhost:7082/api/WorkShops/Read/' + code
//         ).then(res =>
//             data = res.data
//         )
//         return data
//     }
// )

export const GetDiagnosersOfThisWorkshop = createAsyncThunk("GetDiagnosersOfThisWorkshop",
    async (workshop) => {
        let data
        await axios.get('https://localhost:7082/api/WorkShops/GetLDiagnosers/' + workshop.morfology + '/' + workshop.grafology + '/' + workshop.chirology + '/' + workshop.typeGroup)
            .then(res =>
                data = res.data
            )
        return data
    }
)

export const GetDiagnosersOfConditions= createAsyncThunk("GetDiagnosersOfConditions",
    async ({c, g, m}) => {
        let data
        await axios.get('https://localhost:7082/Diagnosers/GetDiagnosers/' + c + '/' + g + '/' + m)
            .then(res =>
                data = res.data
            )
        return data
    }
)


const WorkShopSlice = createSlice({
    name: "WorkShop",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(InitWorkShops.pending, (state) => {
                state.status = "loading"
            })
            .addCase(InitWorkShops.fulfilled, (state, action) => {
                state.status = "succesfull"
                state.WorkShops = action.payload;
            })
            .addCase(InitWorkShops.rejected, (state) => {
                state.status = "faild"
            })
            .addCase(addWorkShop.fulfilled, (state, action) => {
                const workshop = action.payload;
                state.status = "succesfull";
                state.WorkShops.push(workshop)
            })
            .addCase(deleteWorkShop.fulfilled, (state, action) => {
                const workshop = action.payload;
                state.status = "succesfull";
                state.WorkShops = state.WorkShops.filter(d => d.code != workshop.code)
            })
            .addCase(deleteWorkShop.pending, (state) => {
                state.status = "loading"
            })
            .addCase(deleteWorkShop.rejected, (state) => {
                console.log("נכשל");
                
                state.status = "faild"
            })
            .addCase(updateWorkShop.fulfilled, (state, action) => {
                const workshop = action.payload;
                let i = state.WorkShops.findIndex(d => d.code === workshop.code)
                state.WorkShops[i] = workshop
            })
            // .addCase(getType.fulfilled, (state, action) => {
            //     InitWorkShops()
            //     return action.payload
            // })
            // .addCase(getType.rejected, (state, action) => {
            //     // return {ll:"lllllllllllll"}
            // })
            // .addCase(getType.fulfilled, (state, action) => {
            // InitWorkShops()
            // state.type = action.payload;
            // })
            .addCase(getType.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(GetWorkShop.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(GetWorkShop.rejected, (state) => {
                // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
            })
            .addCase(GetDiagnosersOfThisWorkshop.fulfilled, (state, action)=>{
                state.Diagnosers=action.payload;
            })
            .addCase(GetDiagnosersOfConditions.fulfilled, (state, action)=>{
                state.Diagnosers=action.payload;
            });
    }
})

export default WorkShopSlice.reducer;