import * as React from 'react';
import classNames from 'classnames';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as AuthenticationApi from '../modules/authentication/api';
import { Layout } from '../components/layout/layout';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { CustomButton } from '../components/custom-buttom/custom-button';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';

import styles from './password-recovery.module.scss';

interface State {
    submitError: string | null;
    submitStatus: FetchStatus;
}

interface FormData {
    email: string;
}

export default class PasswordRecovery extends React.PureComponent<{}, State> {
    public state: State = {
        submitError: null,
        submitStatus: FetchStatusEnum.initial
    };

    private formInitialValues: FormData = {
        email: ''
    };

    private validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
    });

    private handleSubmit = async (formData: FormData) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                await AuthenticationApi.passwordRecovery(formData.email);
                this.setState({ submitStatus: FetchStatusEnum.success });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, submitError: error.message });
            }
        });
    };

    private renderStatus() {
        const { submitStatus, submitError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        }

        if (submitStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger">{submitError}</CustomStatusBox>;
        }

        if (submitStatus === FetchStatusEnum.success) {
            return <CustomStatusBox type="success">We sent a password reset link to your email address, which allows you to reset your password.</CustomStatusBox>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="Password recovery" showNav showFooter customContentClass={styles['custom-content']}>
                <div className={styles['password-recovery-container']}>
                    <div className={styles['password-recovery-box']}>
                        <h4>Password recovery</h4>
                        <p>Enter your e-mail address below. We'll send an e-mail message within a few minutes so you can create a new password.</p>
                        {this.renderStatus()}
                        <Formik
                            initialValues={this.formInitialValues}
                            validationSchema={this.validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                            {({ errors, touched }) => {
                                return (
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="email">Email address</label>
                                            <Field
                                                name="email"
                                                type="text"
                                                placeholder="john.doe@gmail.com"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.email && touched.email })}
                                            />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <CustomButton type="submit" variant="primary" className={styles['submit-button']}>Submit</CustomButton>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </Layout>
        );
    }
}
