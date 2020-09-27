import * as React from 'react';
import Router from 'next/router';
import Image from 'react-bootstrap/Image';
import { Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { getTotalItems } from '../../modules/cart/selector';

import styles from './cart-box.module.scss';

interface Props {
    totalItems: number;
}

const CartBox: React.FC<Props> = ({ totalItems }) => {
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

const mapStateToProps = (state: AppState) => ({
    totalItems: getTotalItems(state.cart)
});

export const CartBoxContainer = connect(mapStateToProps)(CartBox);
