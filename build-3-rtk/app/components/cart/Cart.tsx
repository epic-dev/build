'use client';
import { addItem, clearCart, fetchCartAsync, removeItem, sd, selectCartCount, selectCartTotal, selectItems, selectStatus, setQty, setStatus } from "@/lib/features/cart/cartSlice";
import { checkoutCompleted } from "@/lib/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const Cart = () => {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectItems)
    const status = useAppSelector(selectStatus)
    const totalCount = useAppSelector(selectCartCount)
    const totalSum = useAppSelector(selectCartTotal)
    const totalSum2 = useAppSelector(sd)
    const handleAddClick = () => {
        dispatch(addItem({
            item: {
                id: String(Math.floor(Math.random() * 10)),
                qty: 1,
                title: '1',
                price: Math.floor(Math.random() * 100)
            }
        }))
    }
    const handleDeleteClick = () => {
        dispatch(removeItem({
            id: String(Math.floor(Math.random() * 10)),
        }))
    }
    const handleAddQty = () => {
        dispatch(setQty({
            id: '1',
            qty: 10
        }))
    }
    const handleClear = () => {
        dispatch(clearCart())
    }
    const handleStatus = () => {
        dispatch(setStatus({ status: 'loading' }))
    }
    const handleAddAsyncClick = () => {
        dispatch(fetchCartAsync('11'))
    }

    const handleCheckout = () => {
        dispatch(checkoutCompleted({
            order: {
                id: '111',
                items: [{ id: '2', title: 'to order', price: 200, qty: 1 }]
            }
        }))
    }

    return <>
        <hr />
        <section>
            Items: {JSON.stringify(items, undefined, 2)}
            <br />
            Total items: {totalCount}
            <br />
            Total sum: {totalSum} | {totalSum2}
            <br />
            Cart status: {status}
        </section>
        <br />
        <br />
        <hr />
        <button onClick={handleAddClick}> add item to cart</button>
        <button onClick={handleDeleteClick}> remove item from cart</button>
        <button onClick={handleAddQty}> increase qty </button>
        <button onClick={handleClear}> clear cart </button>
        <button onClick={handleStatus}> set cart status </button>
        <button onClick={handleAddAsyncClick}> add item async </button>
        <button onClick={handleCheckout}> checkout </button>
    </>
}