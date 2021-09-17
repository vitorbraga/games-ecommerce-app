import React from 'react';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout/layout';
import { UserSession } from '../../modules/user/model';
import { FetchStatus, FetchStatusEnum } from '../../utils/api-helper';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import * as ReviewsApi from '../../modules/reviews/api';
import { Review } from '../../modules/reviews/model';
import { ReviewCard } from '../../components/reviews/review-card';
import { AppState } from '../../store';
import { getUserSession } from '../../modules/user/selector';
import { connect } from 'react-redux';

import styles from './reviews.module.scss';

interface Props {
    authToken: string;
    userSession: UserSession;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    reviews: Review[];
}

class ReviewsPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        reviews: []
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { userSession: { id: userId }, authToken } = this.props;

                const reviews = await ReviewsApi.getUserReviews(userId, authToken);
                this.setState({ fetchStatus: FetchStatusEnum.success, reviews });
            } catch (error: unknown) {
                const { message } = error as Error;
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: message });
            }
        });
    }

    public render() {
        const { reviews } = this.state;

        return (
            <Layout title="My reviews" showNav>
                <BaseStructure activeMenuItem={SideMenuItemEnum.reviews}>
                    <div className={styles['reviews-container']}>
                        <h3 className={styles.title}>My reviews</h3>
                        {reviews.length > 0
                            ? reviews.map((review) => <ReviewCard review={review} key={`review-${review.id}`} />)
                            : <div>You made no reviews yet.</div>}
                    </div>
                </BaseStructure>
            </Layout>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    userSession: getUserSession(state.user)
});

export default connect(mapStateToProps)(withAuthenticationCheck(ReviewsPage, '/account/reviews'));
