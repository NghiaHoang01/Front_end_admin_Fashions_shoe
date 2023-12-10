import { configureStore } from "@reduxjs/toolkit"
import headerReducer from 'components/Header/HeaderSlice'
import loginReducer from 'page/Login/LoginSlice'
import productsReducer from 'page/Products/ProductsSlice'
import ordersReducer from "page/Orders/OrdersSlice"

const store = configureStore({
    reducer: {
        header: headerReducer,
        login: loginReducer,
        products: productsReducer,
        orders: ordersReducer
    }
})

export default store