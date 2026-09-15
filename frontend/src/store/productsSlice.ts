import { createSlice } from '@reduxjs/toolkit'
import type { Product, ProductDetail } from '../types'
import { products, productDetails } from '../data/products'
import type { RootState } from './index'

interface ProductsState {
  items: Product[]
  details: Record<string, ProductDetail>
}

// Seeded from mock data for now. When the API is ready, replace this with an
// async thunk (createAsyncThunk + axios) that fills `items`/`details`.
const initialState: ProductsState = {
  items: products,
  details: productDetails,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
})

export default productsSlice.reducer

export const selectProducts = (state: RootState) => state.products.items

export const selectProductById = (id: string) => (state: RootState) =>
  state.products.items.find((p) => p.id === id)

export const selectProductDetail = (id: string) => (state: RootState) =>
  state.products.details[id]

export const selectProductsByIds = (ids: string[]) => (state: RootState) =>
  ids
    .map((id) => state.products.items.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
