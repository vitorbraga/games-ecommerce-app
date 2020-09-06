/* eslint-disable no-underscore-dangle */
import React from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { wrapper } from '../store';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
    const store = useStore((state) => state);
    return (
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
            <Component {...pageProps} />
        </PersistGate>
    );
}

export default wrapper.withRedux(MyApp);
