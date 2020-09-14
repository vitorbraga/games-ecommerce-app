import * as React from 'react';
import Router from 'next/router';
import { isAuthenticated } from '../modules/authentication/helpers';
import { connect } from 'react-redux';
import { authToken } from '../modules/authentication/selector';
import { AppState } from '../store';

function authCheck(WrappedComponent: any) {
    return class extends React.Component<unknown & { authToken: string | null }> {
        public render() {
            if (isAuthenticated(this.props.authToken)) {
                return <WrappedComponent {...this.props} />;
            } else {
                Router.push('/login');
                return null;
            }
        }
    };
}

export function withAuthenticationCheck(WrappedComponent: any) {
    const mapStateToProps = (state: AppState) => ({
        authToken: authToken(state.authentication)
    });

    const componentWithAuthChecked = authCheck(WrappedComponent);

    return connect(mapStateToProps)(componentWithAuthChecked);
}
