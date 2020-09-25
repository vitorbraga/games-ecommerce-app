import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';

import styles from './custom-spinner.module.scss';

export const CustomSpinner: React.FC<{}> = () => {
    return (
        <div className={styles['custom-spinner-wrapper']}>
            <Spinner animation="border" className={styles['custom-spinner']} />
        </div>
    );
};
