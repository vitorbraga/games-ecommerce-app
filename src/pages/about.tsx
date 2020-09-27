import React from 'react';
import { Layout } from '../components/layout/layout';

import styles from './about.module.scss';

interface State {
    text: string;
}

export default class About extends React.Component<{}, State> {
    public state: State = {
        text: ''
    };

    public render() {
        return (
            <Layout title="About" showNav showFooter>
                <h1 className={styles.test}>This is About page ✌</h1>
            </Layout>
        );
    }
};
