import React from 'react';
import { Layout } from '../components/layout/layout';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NextPageContext } from 'next';
import { AppState } from '../store';
import { authToken } from '../modules/authentication/selector';
import { setAuthToken } from '../modules/authentication/actions';
import { setUserSession } from '../modules/user/actions';
import { UserSession } from '../modules/user/model';
import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import * as AuthenticationApi from '../modules/authentication/api';
import { JwtAuthToken } from '../modules/authentication/helpers';
import { FetchStatus, FetchStatusEnum } from '../utils/api-helper';
import { CustomButton } from '../components/custom-buttom/custom-button';
import { CustomSpinner } from '../components/custom-spinner/custom-spinner';
import { CustomStatusBox } from '../components/custom-status-box/custom-status-box';

import styles from './login.module.scss';

interface Props {
    authToken: string | null;
    onSetAuthenticationToken: (authToken: string | null) => void;
    onSetUserSession: (userSession: UserSession | null) => void;
    query: { redirectTo?: string };
}

interface State {
    email: string;
    password: string;
    loginError: string | null;
    submitStatus: FetchStatus;
}

interface LoginContext extends NextPageContext {
    query: {
        redirectTo?: string;
    };
}

class LoginPage extends React.PureComponent<Props, State> {
    public state: State = {
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
        this.setState({ [field]: event.target.value } as Pick<State, any>);
    };

    private handleSubmit = () => {
        if (this.isValidBeforeLogin()) {
            this.setState({ submitStatus: FetchStatusEnum.loading, loginError: null }, async () => {
                try {
                    const authenticationToken = await AuthenticationApi.authenticate(this.state.email, this.state.password);
                    const decoded = jwtDecode<JwtAuthToken>(authenticationToken);
                    this.props.onSetAuthenticationToken(authenticationToken);
                    this.props.onSetUserSession(decoded.userSession);

                    const redirectTo = this.props.query.redirectTo || '/';
                    Router.push(redirectTo);
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
            return <CustomStatusBox type="danger">{loginError}</CustomStatusBox>;
        }

        return null;
    }

    public render() {
        return (
            <Layout title="Login" showNav={false} customContentClass={styles['custom-content']}>
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
                            <div className={styles['password-forgot-wrapper']}>
                                <Link href="/password-recovery">Forgot password?</Link>
                            </div>
                            <CustomButton variant="primary" className={styles['submit-button']} onClick={this.handleSubmit}>Login</CustomButton>
                        </Form>
                        <div className={styles['register-wrapper']}>
                            Are you new? <Link href="/register">Register here</Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    static getInitialProps({ query }: LoginContext) {
        return { query };
    }
}

const mapStateToProps = (state: AppState) => ({
    authToken: authToken(state.authentication)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onSetAuthenticationToken: (authToken: string | null) => dispatch(setAuthToken(authToken)),
    onSetUserSession: (userSession: UserSession | null) => dispatch(setUserSession(userSession))
});

const LoginPageContainer = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export default LoginPageContainer;
