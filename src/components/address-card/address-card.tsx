import * as React from 'react';
import classNames from 'classnames';
import Card from 'react-bootstrap/Card';
import { Address } from '../../modules/address/model';

import styles from './address-card.module.scss';

interface Props {
    address: Address;
    isSelected?: boolean;
    footer?: React.ReactNode;
    fullWidth?: boolean;
    customClass?: string;
}

export const AddressCard: React.FC<Props> = ({ address, isSelected, footer, fullWidth, customClass }) => {
    return (
        <Card
            className={classNames(styles['address-card'],
                customClass,
                { [styles.selected]: isSelected },
                { [styles['full-width']]: fullWidth }
            )}
        >
            <Card.Body>
                <Card.Title className={styles['card-title']}>{address.fullName}</Card.Title>
                <div className={styles['card-body']}>
                    <div>
                        <div>{address.line1}</div>
                        <div>{address.line2}</div>
                        <div>{`${address.city}, ${address.country.name}`}</div>
                        <div>{address.zipCode}</div>
                        <div><i>{address.info}</i></div>
                    </div>
                </div>
            </Card.Body>
            {footer && <Card.Footer>{footer}</Card.Footer>}
        </Card>
    );
};
