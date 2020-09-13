import { connect } from 'react-redux';
import { AppState } from '../store';
import { user } from '../modules/user/selector';
import { UserBox } from '../widgets/user-box/user-box';
import { userLogout } from '../modules/authentication/actions';
import { Dispatch } from 'redux';

const mapStateToProps = (state: AppState) => ({
    user: user(state.user)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    userLogout: () => dispatch(userLogout())
});

export const UserBoxContainer = connect(mapStateToProps, mapDispatchToProps)(UserBox);
