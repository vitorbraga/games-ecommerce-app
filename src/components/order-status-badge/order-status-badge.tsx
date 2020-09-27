import * as React from 'react';
import Badge from 'react-bootstrap/Badge';
import { OrderStatus, orderStatusMapper } from '../../modules/orders/model';

interface Props {
    orderStatus: OrderStatus;
}

export const OrderStatusBadge: React.FC<Props> = ({ orderStatus }) => {
    const { label, color } = orderStatusMapper[orderStatus];

    return (
        <Badge variant="secondary" style={{ backgroundColor: color }}>
            {label}
        </Badge>
    );
};
