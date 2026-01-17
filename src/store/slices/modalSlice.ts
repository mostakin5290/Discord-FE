import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    invitecodeModalOpen: boolean;
    leaveServerModalOpen: boolean;
    createChannelModalOpen: boolean;
    settingsModalOpen: boolean;
};

const initialState: ModalState = {
    invitecodeModalOpen: false,
    leaveServerModalOpen: false,
    createChannelModalOpen: false,
    settingsModalOpen: false,
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
        },
        setSettingsModalOpen: (state) => {
            state.settingsModalOpen = !state.settingsModalOpen;
        }
    }
});

export const { setInvitecodeModalOpen, setLeaveServerModelOpen, setCreateChannelModelOpen, setSettingsModalOpen } = modalSlice.actions;
export default modalSlice.reducer;