import { createSlice } from "@reduxjs/toolkit";
import { orderSlice } from "../orders/orderSlice";

export const metricsSlice = createSlice({
    name: 'metrics',
    initialState: {
        ordersCount: 0
    },
    reducers: {
        incrementOrders(state) {
            state.ordersCount += 1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(orderSlice.actions.checkoutCompleted, (state) => {
            console.log('extra reducers metrics state', state)
            metricsSlice.actions.incrementOrders()
        })
    }
})