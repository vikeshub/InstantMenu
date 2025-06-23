import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import restaurantReducer from '../features/restaurant/restaurantSlice';
// import cartReducer from '../features/cart/cartSlice';
// import menuReducer from '../features/menu/menuSlice';
// import ordersReducer from '../features/orders/ordersSlice';
// import dashboardReducer from '../features/dashboard/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  // cart: cartReducer,
  // menu: menuReducer,
  // orders: ordersReducer,
  // dashboard: dashboardReducer,
});

export default rootReducer;
