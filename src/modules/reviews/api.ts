import { headersBuilder, serverBaseUrl } from '../../utils/api-helper';
import { getErrorMessage } from '../../utils/messages-mapper';
import * as Model from './model';

export const getUserReviews = async (userId: string, authToken: string): Promise<Model.Review[]> => {
    const options = {
        headers: headersBuilder().with('Content-Type', 'application/json').with('Accept', 'application/json').withJwt(authToken).build()
    };

    const response: Response = await fetch(`${serverBaseUrl}/users/${userId}/reviews`, options);
    const userReviewsResponse: Model.GetUserReviewsResponse = await response.json();

    if (userReviewsResponse.success) {
        return userReviewsResponse.reviews;
    } else {
        throw new Error(getErrorMessage(userReviewsResponse.error));
    }
};
