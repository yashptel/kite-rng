import { configureStore, nanoid } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import _ from "lodash";

const SECRET_KEY = "H6&Xb?$Q4ta9e68EPHkk";

const initialState = {
  currentSettings: {
    apiCredentialId: "",
    exchangeId: "",
    tradingPair: "",
    symbol: "",
  },
  inputState: {
    stopLoss: 0,
    takeProfit: 0,
    lossPerTrade: 0,
  },
  apiCredentials: [],
  temporaryState: {
    isLoading: 0,
    isSettingsModalOpen: false,
    dynamicElements: [],
  },
};

// for (let i = 0; i < 5; i++) {
//   initialState.apiCredentials.push({
//     id: nanoid(),
//     exchangeId: "E0GKF97sIEnbz0i1GeFx2",
//     name: "Binance",
//     apiKey: "kdslfj83fj3289uhi3f",
//     secretKey: "3klj32jhkf7893f2h893298y32rthuf23y8923789yf",
//     passphrase: "3f289yf23h89",
//   });
// }

const persistConfig = {
  key: "state",
  storage: localForage,
  transforms: [
    encryptTransform({
      secretKey: SECRET_KEY,
      onError: function (error) {
        console.error("redux-persist-transform-encrypt error", error);
      },
    }),
  ],
  blacklist: ["temporaryState"],
};

const stateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_API_CREDENTIALS":
      return {
        ...state,
        apiCredentials: [
          ...state.apiCredentials,
          {
            ...action.data,
            id: nanoid(),
          },
        ],
      };

    case "UPDATE_API_CREDENTIALS":
      return {
        ...state,
        apiCredentials: state.apiCredentials.map((item) =>
          item.id === action.data.id ? action.data : item
        ),
      };

    case "DELETE_API_CREDENTIALS":
      return {
        ...state,
        apiCredentials: state.apiCredentials.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "SET_IS_LOADING":
      return {
        ...state,
        temporaryState: {
          ...state.temporaryState,
          isLoading: action.payload
            ? state.temporaryState.isLoading + 1
            : _.max([state.temporaryState.isLoading - 1, 0]),
        },
      };

    case "SET_CURRENT_SETTINGS":
      return {
        ...state,
        currentSettings: action.data,
      };

    case "SET_CURRENT_SETTINGS_MODAL":
      return {
        ...state,
        temporaryState: {
          ...state.temporaryState,
          isSettingsModalOpen: action.payload,
        },
      };

    case "SET_EXCHANGE_ID":
      return {
        ...state,
        currentSettings: {
          ...state.currentSettings,
          exchangeId: action.payload,
        },
      };

    case "SET_TRADING_PAIR":
      return {
        ...state,
        currentSettings: {
          ...state.currentSettings,
          tradingPair: action.payload,
        },
      };

    case "ADD_DYNAMIC_ELEMENT":
      return {
        ...state,
        temporaryState: {
          ...state.temporaryState,
          dynamicElements: [
            ...state.temporaryState.dynamicElements,
            action.payload,
          ],
        },
      };

    case "REMOVE_DYNAMIC_ELEMENT":
      return {
        ...state,
        temporaryState: {
          ...state.temporaryState,
          dynamicElements: state.temporaryState.dynamicElements.filter(
            (item) => item.id !== action.payload
          ),
        },
      };

    default:
      return state;
  }
};

const persistedReducer = persistReducer(persistConfig, stateReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);