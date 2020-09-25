import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Login } from '../components/login';
import { AppState } from '../store';
import { authToken } from '../modules/authentication/selector';
import { setAuthToken } from '../modules/authentication/actions';
import { setUserSession } from '../modules/user/actions';
import { UserSession } from '../modules/user/model';

const mapStateToProps = (state: AppState) => ({
    authToken: authToken(state.authentication)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onSetAuthenticationToken: (authToken: string | null) => dispatch(setAuthToken(authToken)),
    onSetUserSession: (userSession: UserSession | null) => dispatch(setUserSession(userSession))
});

export const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
