import React from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Layout } from '../components/layout/layout';
import { registerUser } from '../modules/user/api';
import { errorMapper } from '../utils/messages-mapper';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { checkPasswordComplexity } from '../utils/validators';
import { CustomButton } from '../components/custom-buttom/custom-button';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';

import styles from './register.module.scss';

interface State {
    registerError: string | null;
    submitStatus: FetchStatus;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    termsAgreement: boolean;
}

class RegisterPage extends React.PureComponent<{}, State> {
    public state: State = {
        registerError: null,
        submitStatus: FetchStatusEnum.initial
    };

    private formInitialValues: FormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        termsAgreement: false
    };

    private validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .test('password-complexity', errorMapper.REGISTER_PASSWORD_COMPLEXITY, checkPasswordComplexity),
        termsAgreement: Yup.boolean()
            .oneOf([true], errorMapper.REGISTER_TERMS_AGREEMENT)
            .required('This field is required')
    });

    private handleSubmit = async (formData: FormData) => {
        this.setState({ submitStatus: FetchStatusEnum.loading }, async () => {
            try {
                const userOrFieldsWithErrors = await registerUser(formData);
                if ('id' in userOrFieldsWithErrors) {
                    Router.push('/register-success');
                } else {
                    const fieldsWithErrors = userOrFieldsWithErrors;
                    if (fieldsWithErrors.length > 0) {
                        this.setState({ submitStatus: FetchStatusEnum.failure, registerError: errorMapper[Object.values(fieldsWithErrors[0].constraints)[0]] });
                    }
                }
            } catch (error) {
                this.setState({ submitStatus: FetchStatusEnum.failure, registerError: error.message });
            }
        });
    };

    private renderStatus() {
        const { submitStatus, registerError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        }

        if (submitStatus === FetchStatusEnum.failure) {
            return <CustomStatusBox type="danger">{registerError}</CustomStatusBox>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="Register" showNav showFooter>
                <div className={styles['register-container']}>
                    <div className={styles['register-box']}>
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
                                            <label htmlFor="firstName">First Name</label>
                                            <Field
                                                name="firstName"
                                                placeholder="John"
                                                type="text"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.firstName && touched.firstName })}
                                            />
                                            <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <Field
                                                name="lastName"
                                                placeholder="Doe"
                                                type="text"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.lastName && touched.lastName })}
                                            />
                                            <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <Field
                                                name="email"
                                                type="text"
                                                placeholder="john.doe@gmail.com"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.email && touched.email })}
                                            />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Field
                                                name="password"
                                                type="password"
                                                placeholder="At least 6 characters"
                                                className={classNames('form-control', styles['text-input'], { 'is-invalid': errors.password && touched.password })}
                                            />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group form-check">
                                            <Field type="checkbox" name="termsAgreement" className={'form-check-input ' + (errors.termsAgreement && touched.termsAgreement ? ' is-invalid' : '')} />
                                            <label htmlFor="termsAgreement" className="form-check-label">Accept Terms and Conditions</label>
                                            <ErrorMessage name="termsAgreement" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <CustomButton type="submit" variant="primary" className={styles['submit-button']}>Register</CustomButton>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                        <div className={styles['login-wrapper']}>
                            Already have an account? <Link href="/login">Sign in here</Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
};

export default RegisterPage;
