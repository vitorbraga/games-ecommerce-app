/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { wrapper } from '../store';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';

import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
    const store = useStore((state) => state);
    const router = useRouter();

    useEffect(() => {
        router.beforePopState(({ as }) => {
            location.href = as;
        });
    }, []);

    return (
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
            <Component {...pageProps} />
        </PersistGate>
    );
}

export default wrapper.withRedux(MyApp);
