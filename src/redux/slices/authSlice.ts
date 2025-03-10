import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '../../utils/interfaces';

const BASE_URL = 'https://reqres.in/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  loadingUserInfo: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  loadingUserInfo: false,
  error: null
};

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    {
      id,
      first_name,
      last_name,
      email
    }: { id: number; first_name: string; last_name: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}`, {
        first_name,
        last_name,
        email
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to update user profile');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch user info');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password
      });
      const token = response.data.token;

      // Fetch all users to find the logged user's ID since their API doesn't return user id upon login, just token
      const usersResponse = await axios.get(`${BASE_URL}/users`);
      const user = usersResponse.data.data.find((u: User) => u.email === email);

      if (!user) {
        return rejectWithValue('User not found');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch(fetchUserProfile(user.id));

      return { email, token, id: user.id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        email,
        password
      });

      //Upon registration, we do get user id so we can immediately fetch user info
      const id = response.data.id;
      const token = response.data.token;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify({ id, email }));

      dispatch(fetchUserProfile(id));

      return { email, token, id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
  },
  extraReducers: builder => {
    builder
      //Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { email: action.payload.email };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Registration
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { email: action.payload.email, id: action.payload.id };
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Fetch User Profile
      .addCase(fetchUserProfile.pending, state => {
        state.loadingUserInfo = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loadingUserInfo = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(fetchUserProfile.rejected, state => {
        state.loadingUserInfo = false;
      })
      //Edit Profile
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
