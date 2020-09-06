import { connect } from 'react-redux';
import { AppState } from '../store';
import { user } from '../modules/user/selector';
import { AuthenticationBox } from '../widgets/authentication-box/authentication-box';
import { userLogout } from '../modules/authentication/actions';
import { Dispatch } from 'redux';

const mapStateToProps = (state: AppState) => ({
    user: user(state.user)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    userLogout: () => dispatch(userLogout())
});

export const AuthenticationBoxContainer = connect(mapStateToProps, mapDispatchToProps)(AuthenticationBox);
