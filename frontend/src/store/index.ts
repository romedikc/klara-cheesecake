import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import productsReducer from './productsSlice'
import coursesReducer from './coursesSlice'
import accountReducer from './accountSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    courses: coursesReducer,
    account: accountReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
