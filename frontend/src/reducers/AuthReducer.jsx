import { createSlice } from '@reduxjs/toolkit';
import { http } from '../utils/Config';

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const AuthReducer = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        authSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { authStart, authSuccess, authFailure, logout } = AuthReducer.actions;

export default AuthReducer.reducer;

export const signInAsync = ({ email, password }) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await http.post('signin', { user_email: email, user_password: password });
        const { user, accessToken } = response.data;

        localStorage.setItem('token', accessToken);

        dispatch(authSuccess({ user, token: accessToken }));
    } catch (error) {
        dispatch(authFailure(error.response.data.message));
    }
};


export const signUpAsync = (fullname, email, password) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await http.post('signup', {
            user_fullname: fullname,
            user_email: email,
            user_password: password, // Ensure this matches your backend requirements
            user_image: "https://i.pravatar.cc/300", // Auto-assign default image
            user_currency_unit: "USD", // Auto-assign default currency unit
        });
        const { user, accessToken } = response.data;

        localStorage.setItem('token', accessToken);

        dispatch(authSuccess({ user, token: accessToken }));
    } catch (error) {
        dispatch(authFailure(error.response.data.message));
    }
};

export const signOutAsync = () => (dispatch) => {
    return new Promise((resolve) => {
        localStorage.removeItem('token');
        dispatch(logout());
        resolve();
    });
};