import * as React from 'react';
import classNames from 'classnames';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { errorMapper } from '../utils/messages-mapper';
import * as AuthenticationApi from '../modules/authentication/api';
import { Layout } from '../components/layout/layout';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { checkPasswordComplexity } from '../utils/validators';
import { CustomButton } from '../components/custom-buttom/custom-button';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';

import styles from './reset-password.module.scss';

interface Props {
    query: {
        token: string;
        u: string;
    };
}

interface State {
    fetchStatus: FetchStatus;
    fetchError: string | null;
    tokenIsValid: boolean | undefined;
    tokenCheckError: string | null;
}

interface FormData {
    newPassword: string;
    newPasswordConf: string;
}

export default class ChangePasswordWithToken extends React.PureComponent<Props, State> {
    public state: State = {
        fetchStatus: FetchStatusEnum.initial,
        fetchError: null,
        tokenIsValid: undefined,
        tokenCheckError: null
    };

    private formInitialValues: FormData = {
        newPassword: '',
        newPasswordConf: ''
    };

    private validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('New password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPasswordConf: Yup.string()
            .required('New password confirmation is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity)
            .oneOf([Yup.ref('newPassword'), ''], 'New Password and New Password Confirmation must match.')
    });

    public componentDidMount = async () => {
        const { query: { token, u: userId } } = this.props;

        if (token && userId) {
            try {
                await AuthenticationApi.checkValidPasswordResetToken(token, userId);
                this.setState({ tokenIsValid: true });
            } catch (error) {
                this.setState({ tokenIsValid: false, tokenCheckError: error.message });
            }
        } else {
            this.setState({ tokenIsValid: false, tokenCheckError: errorMapper.PASSWORD_RESET_MISSING_TOKEN_USERID });
        }
    };

    private handleSubmit = async (formData: FormData) => {
        this.setState({ fetchStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { query: { token, u: userId } } = this.props;
                await AuthenticationApi.resetPasswordWithToken(formData.newPassword, token, userId);
                this.setState({ fetchStatus: FetchStatusEnum.success });
            } catch (error) {
                this.setState({ fetchStatus: FetchStatusEnum.failure, fetchError: error.message });
            }
        });
    };

    private renderStatus() {
        const { fetchStatus, fetchError } = this.state;

        if (fetchStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        }

        if (fetchStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger">{fetchError}</CustomStatusBox>;
        }

        if (fetchStatus === FetchStatusEnum.success) {
            return <CustomStatusBox type="success">You password was reseted successfully!</CustomStatusBox>;
        }

        return null;
    }

    private renderContent() {
        const { tokenIsValid, tokenCheckError } = this.state;

        if (tokenIsValid === undefined) {
            return null;
        } else if (tokenIsValid) {
            return (
                <div className={styles['password-reset-box']}>
                    <h4>Reset password</h4>
                    <p>Please enter your new password and a confirmation so we can reset it.</p>
                    {this.renderStatus()}
                    <Formik
                        initialValues={this.formInitialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                    >
                        {({ errors, touched }) => {
                            return (
                                <Form style={{ marginTop: '20px' }}>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New password *</label>
                                        <Field
                                            name="newPassword"
                                            type="password"
                                            className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.newPassword && touched.newPassword })}
                                        />
                                        <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPasswordConf">New password confirmation *</label>
                                        <Field
                                            name="newPasswordConf"
                                            type="password"
                                            className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.newPasswordConf && touched.newPasswordConf })}
                                        />
                                        <ErrorMessage name="newPasswordConf" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <CustomButton type="submit" variant="primary" className={styles['submit-button']}>Reset password</CustomButton>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            );
        } else {
            return (
                <div className={styles['invalid-info']}>
                    {tokenCheckError && <CustomStatusBox type="danger">{tokenCheckError}</CustomStatusBox>}
                    <div>We cannot perform the password reset because the needed information is invalid.</div>
                </div>
            );
        }
    }

    public render() {
        return (
            <Layout title="Password recovery" showNav showFooter customContentClass={styles['custom-content']}>
                <div className={styles['password-reset-container']}>
                    {this.renderContent()}
                </div>
            </Layout>
        );
    }

    static getInitialProps({ query }: Props) {
        return { query };
    }
}
