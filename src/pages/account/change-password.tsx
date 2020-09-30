import React from 'react';
import * as Yup from 'yup';
import classNames from 'classnames';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import { BaseStructure } from '../../components/account/base-structure';
import { SideMenuItemEnum } from '../../components/account/side-menu';
import { Layout } from '../../components/layout/layout';
import { FetchStatus, FetchStatusEnum } from '../../utils/api-helper';
import { withAuthenticationCheck } from '../../utils/authentication-wrapper';
import { CustomButton } from '../../components/custom-buttom/custom-button';
import { errorMapper } from '../../utils/messages-mapper';
import { checkPasswordComplexity } from '../../utils/validators';
import * as AuthenticationApi from '../../modules/authentication/api';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../../components/custom-status-box/custom-status-box';

import styles from './change-password.module.scss';

interface Props {
    authToken: string;
}

interface State {
    submitStatus: FetchStatus;
    submitError: string | null;
}

interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConf: string;
}

class ChangePasswordPage extends React.PureComponent<Props, State> {
    public state: State = {
        submitStatus: FetchStatusEnum.initial,
        submitError: null
    };

    private formInitialValues: FormData = {
        currentPassword: '',
        newPassword: '',
        newPasswordConf: ''
    };

    private validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Current password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPassword: Yup.string()
            .required('New password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        newPasswordConf: Yup.string()
            .required('New password confirmation is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity)
            .oneOf([Yup.ref('newPassword'), ''], 'New Password and New Password Confirmation must match.')
    });

    private handleSubmit = async (formData: FormData, { resetForm }: FormikHelpers<FormData>) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                const { currentPassword, newPassword } = formData;
                const { authToken } = this.props;

                await AuthenticationApi.changePassword(currentPassword, newPassword, authToken);

                this.setState({ submitStatus: FetchStatusEnum.success }, () => {
                    resetForm();
                });
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, submitError: error.message });
            }
        });
    };

    private renderSubmitStatus() {
        const { submitStatus, submitError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        } else if (submitStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger">{submitError}</CustomStatusBox>;
        } else if (submitStatus === FetchStatusEnum.success) {
            return <CustomStatusBox type="success">Password changed successfully.</CustomStatusBox>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="Change password" showNav customContentClass={styles['custom-layout-content']}>
                <BaseStructure activeMenuItem={SideMenuItemEnum.changePassword}>
                    <div className={styles['form-wrapper']}>
                        <h3>Change your password</h3>
                        {this.renderSubmitStatus()}
                        <Formik
                            initialValues={this.formInitialValues}
                            validationSchema={this.validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                            {({ errors, touched }) => {
                                return (
                                    <Form style={{ marginTop: '20px' }}>
                                        <div className="form-group">
                                            <label htmlFor="fullName">Current password *</label>
                                            <Field
                                                name="currentPassword"
                                                type="password"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.currentPassword && touched.currentPassword })}
                                            />
                                            <ErrorMessage name="currentPassword" component="div" className="invalid-feedback" />
                                        </div>
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
                                            <CustomButton type="submit" variant="primary" className={styles['submit-button']}>Change password</CustomButton>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </BaseStructure>
            </Layout>
        );
    }
};

export default withAuthenticationCheck(ChangePasswordPage);
