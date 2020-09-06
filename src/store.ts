/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, Action } from 'redux';
import { authenticationReducer } from './modules/authentication/reducer';
import { userReducer } from './modules/user/reducer';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';

const appReducer = combineReducers({
    authentication: authenticationReducer,
    user: userReducer
});

const rootReducer = (state: any, action: Action) => {
    if (action.type === 'USER_LOGOUT') {
        storage.removeItem('persist:nextjs');
        state = undefined;
    }

    return appReducer(state, action);
};

export type AppState = ReturnType<typeof rootReducer>;

const bindMiddleware = (middleware: any) => {
    if (process.env.NODE_ENV !== 'production') {
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }: any) => {
    if (isServer) {
        // If it's on server side, create a store
        return createStore(rootReducer, bindMiddleware([thunkMiddleware]));
    } else {
        // If it's on client side, create a store which will persist
        const storage = require('redux-persist/lib/storage').default;

        const persistConfig = {
            key: 'nextjs',
            whitelist: ['authentication', 'user'], // fields to be persisted
            storage // if needed, use a safer storage
        };

        const persistedReducer = persistReducer(persistConfig, rootReducer);

        const store = createStore(
            persistedReducer,
            bindMiddleware([thunkMiddleware])
        );

        (store as any).__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

        return store;
    }
};

export const wrapper = createWrapper(makeStore as any);
