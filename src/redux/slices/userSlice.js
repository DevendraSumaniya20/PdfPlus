import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    name: '',
    imageUri: '',
    userId: '',
  },
  reducers: {
    setUser(state, action) {
      return {...state, ...action.payload};
    },
  },
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;
