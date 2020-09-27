import * as React from 'react';
import Router from 'next/router';
import { isAuthenticated } from '../modules/authentication/helpers';
import { connect } from 'react-redux';
import { authToken } from '../modules/authentication/selector';
import { AppState } from '../store';

function authCheck(WrappedComponent: any, redirectTo?: string) {
    return class extends React.Component<unknown & { authToken: string | null }> {
        public render() {
            if (isAuthenticated(this.props.authToken)) {
                return <WrappedComponent {...this.props} />;
            } else {
                Router.push(`/login${redirectTo ? `?redirectTo=${redirectTo}` : ''}`);
                return null;
            }
        }
    };
}

export function withAuthenticationCheck(WrappedComponent: any, redirectTo?: string) {
    const mapStateToProps = (state: AppState) => ({
        authToken: authToken(state.authentication)
    });

    const componentWithAuthChecked = authCheck(WrappedComponent, redirectTo);

    return connect(mapStateToProps)(componentWithAuthChecked);
}
