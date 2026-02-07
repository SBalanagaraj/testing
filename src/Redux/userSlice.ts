import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface UserState {
    userInfo: UserInfo | null;
    isLogin: boolean;
}

const initialState: UserState = {
    userInfo: null,
    isLogin: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            state.isLogin = true;
        },
        clearUserInfo: (state) => {
            state.userInfo = null;
            state.isLogin = false;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
