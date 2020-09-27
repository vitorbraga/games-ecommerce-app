import * as React from 'react';
import { Alert } from 'react-bootstrap';

import styles from './custom-error-box.module.scss';

interface Props {
    style?: React.CSSProperties;
}

export const CustomErrorBox: React.FC<Props> = ({ children, style }) => {
    return (
        <Alert variant="danger" style={style} className={styles['custom-error-box']}>{children}</Alert>
    );
};
