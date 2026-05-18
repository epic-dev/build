import { Action, createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderSlice } from "../orders/orderSlice";

export function delay<T>(ms: number, value?: T): Promise<T | undefined> {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export type CartItem = { id: string; title: string; price: number; qty: number };
type CartState = {
    items: CartItem[];
    status: 'idle' | 'loading' | 'error';
};

// type _CartState =
//     | { status: 'idle', items: CartItem[] }
//     | { status: 'error' }
//     | { status: 'loading', items: CartItem[] }

const initialState: CartState = {
    items: [],
    status: 'idle'
}

export const fetchCartAsync = createAsyncThunk(
    'cart/fetchByCartId',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = delay(1000, { id: '11', price: 100, title: 'remote', qty: 1 })
            return response
        } catch (e) {
            rejectWithValue({
                error: 'Cart with this id not found'
            })
        }
    }
)

interface RejectedAction extends Action {
    error: Error
}
interface LoadingAction extends Action {
    type: 'loading',
}

function isRejectedAction(action: Action): action is RejectedAction {
    return action.type.endsWith('rejected')
}
function isLoadingAction(action: Action): action is LoadingAction {
    return action.type.endsWith('addItem')
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state: CartState, action: PayloadAction<{ item: CartItem }>) {
            const existing = state.items.find(item => item.id === action.payload.item.id)
            if (existing) {
                existing.qty += 1
            } else {
                state.items.push(action.payload.item)
            }
        },
        removeItem(state: CartState, action: PayloadAction<{ id: string }>) {
            state.items = state.items.filter(item => item.id !== action.payload.id)
        },
        setQty(state: CartState, action: PayloadAction<{ id: string, qty: number }>) {
            const existing = state.items.find(item => item.id === action.payload.id)
            if (existing) {
                state.items = state.items.map((item) => {
                    if (item.id === existing.id) {
                        return {
                            ...existing,
                            qty: action.payload.qty
                        }
                    }
                    return item
                })
            } else {
                throw new Error('no such id')
            }
        },
        clearCart(state: CartState) {
            state.items = []
        },
        setStatus(state: CartState, action: PayloadAction<{ status: CartState['status'] }>) {
            state.status = action.payload.status
        }
    },
    selectors: {
        selectItems: (cart) => cart.items,
        selectStatus: (cart) => cart.status,
        selectCartCount: (cart) => {
            let sum = 0;
            for (const item of cart.items) {
                sum += item.qty
            }
            return sum
        },
        selectCartTotal: (cart) => {
            let sum = 0;
            for (const item of cart.items) {
                sum += item.price * item.qty
            }
            return sum
        },
        sd: createSelector((state: CartState) => state, (cart) => {
            let sum = 0;
            for (const item of cart.items) {
                sum += item.price * item.qty
            }
            return sum
        })
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
            if (action.payload) {
                const existing = state.items.find(item => item.id === action.payload?.id)
                if (existing) {
                    existing.qty += 1
                } else {
                    state.items.push(action.payload)
                }
            }
        });
        builder.addCase(fetchCartAsync.pending, (state, action) => {
            state.status = 'loading'
        });
        builder.addCase(fetchCartAsync.rejected, (state, action) => {
            state.status = 'error'
        });
        builder.addCase(orderSlice.actions.checkoutCompleted, (state) => {
            console.log('checkoutCompleted, cleraring the cart')
            state.items = []
        })
        builder.addMatcher(isRejectedAction, (state: CartState) => {
            state.status = 'error'
        })
        builder.addMatcher(isLoadingAction, (state: CartState, action: LoadingAction) => {
            state.status = 'loading';
        })
    }
})

export const { addItem, removeItem, setQty, clearCart, setStatus } = cartSlice.actions;
export const { selectItems, selectStatus, selectCartCount, selectCartTotal, sd } = cartSlice.selectors