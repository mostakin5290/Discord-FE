import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    invitecodeModalOpen: boolean;
    leaveServerModalOpen: boolean;
    createChannelModalOpen: boolean;
    settingsModalOpen: boolean;
    serverSettingsModalOpen: boolean;
};

const initialState: ModalState = {
    invitecodeModalOpen: false,
    leaveServerModalOpen: false,
    createChannelModalOpen: false,
    settingsModalOpen: false,
    serverSettingsModalOpen: false,
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
        },
        setServerSettingsModalOpen: (state) => {
            state.serverSettingsModalOpen = !state.serverSettingsModalOpen;
        }
    }
});

export const { setInvitecodeModalOpen, setLeaveServerModelOpen, setCreateChannelModelOpen, setSettingsModalOpen, setServerSettingsModalOpen } = modalSlice.actions;
export default modalSlice.reducer;