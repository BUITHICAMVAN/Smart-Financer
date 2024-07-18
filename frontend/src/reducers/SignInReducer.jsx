import { createSlice } from "@reduxjs/toolkit";
import { http } from "../utils/Config";

// Initial state
const initialState = {
  user: {
    user_id: null,
    user_fullname: "",
    user_email: "",
    user_email_verified: "",
    user_is_verified: false,
    user_image: "",
    user_currency_unit: "",
    user_created_at: "",
    user_default_language: "",
    user_need_ratio: 0,
    user_want_ratio: 0,
    user_saving_ratio: 0,
    user_expected_income: 0,
  },
  token: null,
  isAuthenticated: false,
  error: null,
};

// Slice
const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = initialState.user;
      state.token = initialState.token;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { signInSuccess, signInFailure, signOut } = signInSlice.actions;
export default signInSlice.reducer;

// Async thunk for sign-in
export const signInAsync = (username, password) => async (dispatch) => {
  try {
    const response = await http.post("http://localhost:3000/api/signin", {
      username,
      password,
    });
    const data = response.data;
    if (response.status === 200) {
      dispatch(signInSuccess(data));
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userData", JSON.stringify(data.user));
      document.cookie = `access_token=${data.accessToken}`;
    } else {
      dispatch(signInFailure("Invalid username or password"));
    }
  } catch (error) {
    dispatch(signInFailure("An error occurred during sign-in"));
    console.error(error);
  }
};
