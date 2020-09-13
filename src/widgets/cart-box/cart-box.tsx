import * as React from 'react';
import Router from 'next/router';
import Image from 'react-bootstrap/Image';
import { Badge } from 'react-bootstrap';

import styles from './cart-box.module.scss';

interface Props {
    totalItems: number;
}

export const CartBox: React.FC<Props> = ({ totalItems }) => {
    const handleClick = () => {
        Router.push('/cart');
    };

    return (
        <div className={styles['cart-box']} onClick={handleClick}>
            <Image
                src="/cart.svg"
                className={styles['cart-icon']}
                title="Shopping cart"
            />
            {totalItems > 0 && <Badge variant="danger" className={styles['total-badge']}>{totalItems}</Badge>}
        </div>
    );
};
