import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import DisableAccountDialog from "./DisableAccountDialog";

interface MyAccountProps {
  onEditProfile?: () => void;
}

const MyAccount = ({ onEditProfile }: MyAccountProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [disableAccountOpen, setDisableAccountOpen] = useState(false);

  return (
    <div className="w-full h-full text-[#b5bac1]">
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
        My Account
      </h2>
      <p className="text-sm text-[#949ba4] mb-6">
        Manage your account information and settings
      </p>

      {/* Banner & Avatar Card */}
      <div className="bg-[#111214] rounded-lg overflow-hidden mb-8 relative group shadow-lg border border-[#1a1b1e] hover:border-[#2e3035] transition-all duration-300">
        {/* Banner */}
        <div className="h-[100px] bg-gradient-to-br from-[#5865f2] to-[#3b47d4] relative">
          {user?.bannerUrl ? (
            <img
              src={user.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5865f2] to-[#3b47d4]" />
          )}
        </div>

        {/* Avatar */}
        <div className="absolute top-[76px] left-[16px] p-1.5 bg-[#111214] rounded-full shadow-xl">
          <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-[#111214] ring-4 ring-[#111214]/50">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#5865f2] to-[#4752c4] text-white text-2xl font-bold shadow-inner">
                {(user?.username?.[0] || "U").toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-[#23a559] border-[4px] border-[#111214] rounded-full shadow-lg" />
        </div>

        {/* User Info & Actions */}
        <div className="pt-[50px] px-4 pb-4 flex justify-between items-end">
          <div className="flex-1">
            <div className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              {user?.username}
              <span className="text-[#949ba4] font-normal text-sm">
                #{user?.id?.slice(0, 4) || "0000"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#23a559]">
              <div className="w-2 h-2 bg-[#23a559] rounded-full animate-pulse" />
              <span className="font-medium">Online</span>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Edit User Profile
          </button>
        </div>

        {/* Info Fields */}
        <div className="p-4 bg-[#1e1f22] m-4 rounded-lg space-y-4 border border-[#26272b]">
          <div className="flex justify-between items-center group/field p-2 rounded-md hover:bg-[#26272b] transition-colors">
            <div>
              <label className="text-xs font-bold uppercase text-[#949ba4] tracking-wide">
                Display Name
              </label>
              <div className="text-white text-base font-medium">
                {user?.firstName || user?.username}
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#4e5058] text-white text-xs font-semibold rounded hover:bg-[#6d6f78] transition-all duration-200 hover:shadow-md opacity-0 group-hover/field:opacity-100">
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center group/field p-2 rounded-md hover:bg-[#26272b] transition-colors">
            <div>
              <label className="text-xs font-bold uppercase text-[#949ba4] tracking-wide">
                Username
              </label>
              <div className="text-white text-base font-medium">
                {user?.username}
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#4e5058] text-white text-xs font-semibold rounded hover:bg-[#6d6f78] transition-all duration-200 hover:shadow-md opacity-0 group-hover/field:opacity-100">
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center group/field p-2 rounded-md hover:bg-[#26272b] transition-colors">
            <div>
              <label className="text-xs font-bold uppercase text-[#949ba4] tracking-wide">
                Email
              </label>
              <div className="text-white text-base font-medium">
                {user?.email
                  ? user.email.replace(/(.{2})(.*)(@.*)/, "$1****$3")
                  : "********@***.com"}
                <span className="ml-2 text-[#00a8fc] text-sm cursor-pointer hover:underline font-medium">
                  Reveal
                </span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#4e5058] text-white text-xs font-semibold rounded hover:bg-[#6d6f78] transition-all duration-200 hover:shadow-md opacity-0 group-hover/field:opacity-100">
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center group/field p-2 rounded-md hover:bg-[#26272b] transition-colors">
            <div>
              <label className="text-xs font-bold uppercase text-[#949ba4] tracking-wide">
                Phone Number
              </label>
              <div className="text-white text-base font-medium">
                ********5840
                <span className="ml-2 text-[#00a8fc] text-sm cursor-pointer hover:underline font-medium">
                  Reveal
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[#b5bac1] hover:underline text-xs font-semibold transition-colors opacity-0 group-hover/field:opacity-100">
                Remove
              </button>
              <button className="px-3 py-1.5 bg-[#4e5058] text-white text-xs font-semibold rounded hover:bg-[#6d6f78] transition-all duration-200 hover:shadow-md opacity-0 group-hover/field:opacity-100">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3f4147] my-8" />

      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-1">
          Password and Authentication
        </h3>
        <p className="text-sm text-[#949ba4] mb-4">
          Keep your account secure with a strong password
        </p>
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Change Password
        </button>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <div className="border-t border-[#3f4147] my-8" />

      <div>
        <h3 className="text-lg font-bold text-[#f23f42] mb-1 uppercase text-sm tracking-wide">
          Account Removal
        </h3>
        <p className="text-sm text-[#949ba4] mb-4">
          Disabling your account means you can recover it at any time after
          taking this action.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setDeleteAccountOpen(true)}
            className="px-4 py-2 bg-[#da373c] hover:bg-[#a1282b] text-white text-sm font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Delete Account
          </button>
          <button
            onClick={() => setDisableAccountOpen(true)}
            className="px-4 py-2 border-2 border-[#da373c] text-[#da373c] text-sm font-semibold rounded-md hover:bg-[#da373c]/10 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Disable Account
          </button>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      />
      <DisableAccountDialog
        open={disableAccountOpen}
        onOpenChange={setDisableAccountOpen}
      />
    </div>
  );
};

export default MyAccount;
