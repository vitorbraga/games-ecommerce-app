import * as React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { registerUser } from '../modules/user/api';
import { errorMapper } from '../utils/messages-mapper';
import { FetchStatusEnum, FetchStatus } from '../utils/api-helper';
import { checkPasswordComplexity } from '../utils/validators';
import { CustomButton } from '../widgets/custom-buttom/custom-button';

import styles from './register.module.scss';

interface RegisterState {
    registerError: string | null | undefined;
    submitStatus: FetchStatus;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    termsAgreement: boolean;
}

export class Register extends React.PureComponent<{}, RegisterState> {
    public state: RegisterState = {
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
            return <div className={styles['spinner-wrapper']}><Spinner animation="border" variant="info" /></div>;
        }

        if (submitStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">{registerError}</Alert>;
        }

        return null;
    }

    public render() {
        return (
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
                                        <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                        <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                        <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
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
        );
    }
}
