import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';
import * as Model from './model';

export const createOrder = async (createOrderBody: Model.CreateOrderBody, authToken: string): Promise<Model.Order> => {
    const options = {
        headers: headersBuilder()
            .with('Content-Type', 'application/json')
            .with('Accept', 'application/json')
            .withJwt(authToken)
            .build(),
        method: 'POST',
        body: JSON.stringify(createOrderBody)
    };

    const response = await fetch(`${serverBaseUrl}/orders`, options);
    const createOrderResponse: Model.CreateOrderResponse = await response.json();

    if (createOrderResponse.success) {
        return createOrderResponse.order;
    } else {
        throw new Error(getErrorMessage(createOrderResponse.error));
    }
};

export const getOrder = async (orderId: string): Promise<Model.Order> => {
    const response: Response = await fetch(`${serverBaseUrl}/orders/${orderId}`);
    const orderResponse: Model.GetOrderResponse = await response.json();

    if (orderResponse.success) {
        return orderResponse.order;
    } else {
        throw new Error(getErrorMessage(orderResponse.error));
    }
};

export const getUserOrders = async (userId: string, authToken: string): Promise<Model.Order[]> => {
    // TODO will replace this for using userId from authToken (or comparing both)
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/orders`, options);
    const userOrdersResponse: Model.GetUserOrdersResponse = await response.json();

    if (userOrdersResponse.success) {
        return userOrdersResponse.orders;
    } else {
        throw new Error(getErrorMessage(userOrdersResponse.error));
    }
};
