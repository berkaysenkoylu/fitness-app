import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    userId: null,
    userToken: null,
    error: null,
    loading: null
}

const reducer = (state=initialState, action) => {
    switch(action.type)
    {
        case actionTypes.SIGNUP_START:
            return updateObject(state, { error: null, loading: true });
        case actionTypes.SIGNUP_SUCCESS:
            return updateObject(state, { userToken: action.token, error: null, loading: false });
        case actionTypes.SIGNUP_FAIL:
            return updateObject(state, { error: action.error, loading: false });
        case actionTypes.SIGNUP_REDIRECTED:
            return updateObject(state, { userId: null, userToken: null, error: null, loading: false });
        case actionTypes.LOGIN_START:
            return updateObject(state, { userId: null, userToken: null, error: null, loading: true });
        case actionTypes.LOGIN_SUCCESS:
            return updateObject(state, { userId: action.userId, userToken: action.token, error: null, loading: false });
        case actionTypes.LOGIN_FAIL:
            return updateObject(state, { error: action.error, loading: false });
        case actionTypes.LOGOUT:
            return updateObject(state, { userId: null, userToken: null });
        default:
            break;
    }

    return state;
}

export default reducer;