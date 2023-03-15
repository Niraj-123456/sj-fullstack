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
import homeDataReducer from "../features/clients/homeDataSlice";
import clientBookingReducer from "../features/clients/clientBookingSlice";
import clientBenefitReducer from "../features/clients/clientBenefitSlice";
import isClientLoadingReducer from "../features/clients/loadingSlice";
import bookingOptionListsReducer from "../features/bookingOptionLists/bookingOptionListsSlice";
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

const clientReducer = combineReducers({
  homeData: homeDataReducer,
  bookings: clientBookingReducer,
  benefits: clientBenefitReducer,
  isLoading: isClientLoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    persistedReducer,
    clientReducer,
    isLoading: loadingSlice,
    referralCode: referralCodeReducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
  middleware:
    process.env.NEXT_PUBLIC_NODE_ENV === "development"
      ? [...getDefaultMiddleware({ serializableCheck: false }), thunk, logger]
      : [...getDefaultMiddleware({ serializableCheck: false }), thunk],
});

export const persistor = persistStore(store);
