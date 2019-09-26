import * as actionTypes from './actionTypes';
import axiosAuth from '../../axios-auth';

// ========= SIGNUP RELATED ACTIONS ========= //
export const signupStart = () => {
    return {
        type: actionTypes.SIGNUP_START
    };
};

export const signupSuccess = (token) => {
    return {
        type: actionTypes.SIGNUP_SUCCESS,
        token: token
    };
}

export const signupFail = (error) => {
    return {
        type: actionTypes.SIGNUP_FAIL,
        error: error
    };
};

export const redirectedAfterSignup = () => {
    return {
        type: actionTypes.SIGNUP_REDIRECTED
    }
}

export const signup = (userData) => {
    return dispatch => {
        dispatch(signupStart());

        const authData = userData;

        axiosAuth.post('/signup', authData).then(response => {
            dispatch(signupSuccess(response.data.token));
            dispatch(redirectedAfterSignup());
        }).catch(error => {
            dispatch(signupFail(error.response.data.message));
        });
    }
}
// ========= SIGNUP RELATED ACTIONS ========= //


export const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return {
        type: actionTypes.LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');

        if(token === null){
            dispatch(logout());
        }
        else 
        {
            const expirationDate = new Date(localStorage.getItem('expirationTime'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(loginSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logout());
            }
        }
    }
};


// ========= LOGIN RELATED ACTIONS ========= //
export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    };
};

export const loginSuccess = (token, id) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        userId: id,
        token: token
    };
};

export const loginFail = (error) => {
    return {
        type: actionTypes.LOGIN_FAIL,
        error: error
    };
};

export const login = (userData) => {
    return dispatch => {
        dispatch(loginStart());

        const authData = userData;

        axiosAuth.post('/login', authData).then(response => {
            const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);

            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("expirationTime", expirationTime);

            dispatch(loginSuccess(response.data.token, response.data.userId));
            dispatch(checkAuthTimeout(+response.data.expiresIn));
        }).catch(error => {
            dispatch(loginFail(error.response.data.message));
        });
    }
}

// ========= LOGIN RELATED ACTIONS ========= //
