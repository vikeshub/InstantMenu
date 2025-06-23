import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch restaurant profile
export const fetchRestaurantProfile = createAsyncThunk(
  'restaurant/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Use accessToken from localStorage for Authorization header
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch('http://localhost:3000/api/restaurant/profile', {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to update restaurant profile
export const updateRestaurantProfile = createAsyncThunk(
  'restaurant/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch('http://localhost:3000/api/restaurant/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    profile: null,
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearRestaurantProfile: (state) => {
      state.profile = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRestaurantProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.restaurant;
        state.user = action.payload.user;
      })
      .addCase(fetchRestaurantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch profile';
      })
      .addCase(updateRestaurantProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.restaurant;
        state.user = action.payload.user;
      })
      .addCase(updateRestaurantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { clearRestaurantProfile } = restaurantSlice.actions;
export default restaurantSlice.reducer;
