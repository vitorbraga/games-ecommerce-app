import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Login } from '../components/login';
import { AppState } from '../store';
import { authToken } from '../modules/authentication/selector';
import { setAuthToken } from '../modules/authentication/actions';
import { setUser } from '../modules/user/actions';
import { User } from '../modules/user/model';

const mapStateToProps = (state: AppState) => ({
    authToken: authToken(state.authentication)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setAuthenticationToken: (authToken: string | null) => dispatch(setAuthToken(authToken)),
    setUser: (user: User | null) => dispatch(setUser(user))
});

export const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
