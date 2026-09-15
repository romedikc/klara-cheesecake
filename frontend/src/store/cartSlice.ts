import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../types'
import { DELIVERY_COST, initialCartItems } from '../data/cart'
import type { RootState } from './index'

interface CartState {
  items: CartItem[]
  /** Discount applied via promo code, in som. */
  discount: number
}

const initialState: CartState = {
  items: initialCartItems,
  discount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        if (!existing.fixedQuantity) existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item && !item.fixedQuantity) item.quantity += 1
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item && !item.fixedQuantity && item.quantity > 1) item.quantity -= 1
    },
  },
})

export const { addItem, removeItem, incrementQuantity, decrementQuantity } =
  cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartDiscount = (state: RootState) => state.cart.discount

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectDeliveryCost = () => DELIVERY_COST

export const selectCartTotal = (state: RootState) =>
  selectCartSubtotal(state) + DELIVERY_COST - state.cart.discount
