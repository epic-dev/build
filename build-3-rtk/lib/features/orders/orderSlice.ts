import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../cart/cartSlice";

type Order = {
    id: string,
    items: CartItem[]
}
type OrderStatus = {
    order: Order | null,
    status: 'idle' | 'processing' | 'processed'
}

const initialState: OrderStatus = {
    order: null,
    status: 'idle'
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        checkoutCompleted(state, action: PayloadAction<{ order: Order }>) {
            console.log('checkoutCompleted called')
            state.order = action.payload.order
            state.status = 'processing'
        }
    }
})

export const { checkoutCompleted } = orderSlice.actions