import * as React from 'react';
import { Alert } from 'react-bootstrap';

import styles from './custom-status-box.module.scss';

interface Props {
    type: 'danger' | 'success';
    style?: React.CSSProperties;
}

export const CustomStatusBox: React.FC<Props> = ({ children, style, type }) => {
    return (
        <Alert variant={type} style={style} className={styles['custom-status-box']}>{children}</Alert>
    );
};
