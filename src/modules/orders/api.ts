import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { errorMapper } from '../../utils/messages-mapper';
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
        throw new Error(errorMapper[createOrderResponse.error]);
    }
};
