import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    invitecodeModalOpen: boolean;
    leaveServerModalOpen: boolean;
    createChannelModalOpen: boolean;
};

const initialState: ModalState = {
    invitecodeModalOpen: false,
    leaveServerModalOpen: false,
    createChannelModalOpen: false,
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setInvitecodeModalOpen: (state) => {
            state.invitecodeModalOpen = !state.invitecodeModalOpen;
        },
        setLeaveServerModelOpen: (state) => {
            state.leaveServerModalOpen = !state.leaveServerModalOpen
        },
        setCreateChannelModelOpen: (state) => {
            state.createChannelModalOpen = !state.createChannelModalOpen
        }
    }
});

export const { setInvitecodeModalOpen, setLeaveServerModelOpen, setCreateChannelModelOpen } = modalSlice.actions;
export default modalSlice.reducer;