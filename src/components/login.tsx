import * as React from 'react';
import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import * as AuthenticationApi from '../modules/authentication/api';
import { JwtAuthToken } from '../modules/authentication/helpers';
import { User } from '../modules/user/model';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { CustomButton } from '../widgets/custom-buttom/custom-button';
import { CustomSpinner } from '../widgets/custom-spinner/custom-spinner';

import styles from './login.module.scss';

interface LoginProps {
    authToken: string | null;
    setAuthenticationToken: (authToken: string | null) => void;
    setUser: (user: User | null) => void;
}

interface LoginState {
    email: string;
    password: string;
    loginError: string | null;
    submitStatus: FetchStatus;
}

export class Login extends React.PureComponent<LoginProps, LoginState> {
    public state: LoginState = {
        email: '',
        password: '',
        loginError: null,
        submitStatus: FetchStatusEnum.initial
    };

    private isValidBeforeLogin(): boolean {
        const { email, password } = this.state;
        if (!(email && password)) {
            return false;
        }

        return true;
    }

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value } as Pick<LoginState, any>);
    };

    private handleSubmit = () => {
        if (this.isValidBeforeLogin()) {
            this.setState({ submitStatus: FetchStatusEnum.loading, loginError: null }, async () => {
                try {
                    const authenticationToken = await AuthenticationApi.authenticate(this.state.email, this.state.password);
                    const decoded = jwtDecode<JwtAuthToken>(authenticationToken);
                    this.props.setAuthenticationToken(authenticationToken);
                    this.props.setUser(decoded.user);

                    Router.push('/');
                } catch (error) {
                    this.setState({ submitStatus: FetchStatusEnum.failure, loginError: error.message });
                }
            });
        } else {
            this.setState({ loginError: 'Some error' });
        }
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    };

    private renderStatus() {
        const { submitStatus, loginError } = this.state;

        if (submitStatus === FetchStatusEnum.loading) {
            return <CustomSpinner />;
        }

        if (submitStatus === FetchStatusEnum.failure) {
            return <Alert variant="danger">{loginError}</Alert>;
        }

        return null;
    }

    public render() {
        return (
            <div className={styles['login-container']}>
                <div className={styles['login-box']}>
                    <div className={styles['logo-wrapper']}>
                        <Image src="/g-icon.png" className={styles.logo} />
                    </div>
                    {this.renderStatus()}
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="text"
                                placeholder="Email address"
                                className={styles['text-input']}
                                onChange={this.handleInputChange('email')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" style={{ marginBottom: '5px' }}>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className={styles['text-input']}
                                onChange={this.handleInputChange('password')}
                                onKeyUp={this.handleKeyUp}
                            />
                        </Form.Group>
                        <div className={styles['rememberme-wrapper']}>
                            <Form.Group className={styles['rememberme-group']}>
                                <Form.Check type="checkbox" label="Remember me" />
                            </Form.Group>
                            <Link href="/forgot-password">Forgot password?</Link>
                        </div>
                        <CustomButton variant="primary" className={styles['submit-button']} onClick={this.handleSubmit}>Login</CustomButton>
                    </Form>
                    <div className={styles['register-wrapper']}>
                        Are you new? <Link href="/register">Register here</Link>
                    </div>
                </div>
            </div>
        );
    }
}
