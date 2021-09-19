import React from 'react';
import Router from 'next/router';
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
import { CustomModal } from '../../components/custom-modal/custom-modal';
import { CustomButton } from '../../components/custom-buttom/custom-button';

import styles from './reviews.module.scss';

interface Props {
    authToken: string;
    userSession: UserSession;
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    reviews: Review[];
    reviewToRemove: string | null;
}

class ReviewsPage extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        reviews: [],
        reviewToRemove: null
    };

    public componentDidMount() {
        this.setState({ fetchStatus: FetchStatusEnum.loading, fetchError: null }, async () => {
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

    private handleRemoveReview = async () => {
        this.setState({ fetchStatus: FetchStatusEnum.loading, fetchError: null }, async () => {
            try {
                await ReviewsApi.deleteReview(this.state.reviewToRemove!, this.props.authToken);
                Router.reload();
            } catch (error: unknown) {
                const { message } = error as Error;
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: message });
            }
        });
    };

    private handleOpenConfirmationModal = (reviewId: string) => () => {
        this.setState({ reviewToRemove: reviewId });
    };

    private handleCloseConfirmationModal = () => {
        this.setState({ reviewToRemove: null });
    };

    private renderConfirmationModal() {
        return (
            <CustomModal
                title="Remove review"
                show={!!this.state.reviewToRemove}
                onClose={this.handleCloseConfirmationModal}
                footer={
                    <div className={styles['buttons-wrapper']}>
                        <CustomButton variant="secondary" onClick={this.handleCloseConfirmationModal}>Cancel</CustomButton>
                        <CustomButton variant="primary" onClick={this.handleRemoveReview}>Remove review</CustomButton>
                    </div>
                }
            >
                <div>
                    <div>Are you sure you want to remove this review?</div>
                </div>
            </CustomModal>
        );
    }

    public render() {
        const { reviews } = this.state;

        return (
            <Layout title="My reviews" showNav>
                <BaseStructure activeMenuItem={SideMenuItemEnum.reviews}>
                    <div className={styles['reviews-container']}>
                        <h3 className={styles.title}>My reviews</h3>
                        {reviews.length > 0
                            ? reviews.map((review) => {
                                return (
                                    <ReviewCard
                                        review={review}
                                        onRemove={this.handleOpenConfirmationModal(review.id)}
                                        key={`review-${review.id}`}
                                    />
                                );
                            })
                            : <div>You made no reviews yet.</div>}
                        {this.renderConfirmationModal()}
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
