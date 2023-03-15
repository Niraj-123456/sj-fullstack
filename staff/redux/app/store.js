import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import visitorReducer from "../features/visitor/visitorSlice";
import homePageReducer from "../features/homePage/homePageSlice";
import phoneNumberReducer from "../features/phoneNumber/phoneNumberSlice";
import referralCodeReducer from "../features/referralCode/referralCodeSlice";
import userReducer from "../features/user/userSlice";
import bookingOptionListsReducer from "../features/bookingOptionLists/bookingOptionListsSlice";
import bookingReducer from "../features/admin/bookingSlice";
import reviewReducer from "../features/admin/reviewSlice";
import clientListReducer from "../features/admin/clientSlice";
import dashboardReducer from "../features/admin/dashboardSlice";
import loadingReducer from "../features/admin/loadingSlice";
import loadingSlice from "../features/loading/loadingSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  bookingOptionLists: bookingOptionListsReducer,
  visitor: visitorReducer,
  homePage: homePageReducer,
  phoneNumber: phoneNumberReducer,
  user: userReducer,
});

const adminReducer = combineReducers({
  bookings: bookingReducer,
  reviews: reviewReducer,
  loading: loadingReducer,
  clients: clientListReducer,
  dashboard: dashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    persistedReducer,
    adminReducer,
    isLoading: loadingSlice,
    referralCode: referralCodeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware:
    process.env.NEXT_PUBLIC_NODE_ENV === "development"
      ? [...getDefaultMiddleware({ serializableCheck: false }), thunk, logger]
      : [...getDefaultMiddleware({ serializableCheck: false }), thunk],
});

export const persistor = persistStore(store);
