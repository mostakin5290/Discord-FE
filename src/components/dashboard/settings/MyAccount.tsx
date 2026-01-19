import { useSelector } from "react-redux";
import type { RootState } from "@/store/types";
import { useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import DisableAccountDialog from "./DisableAccountDialog";
import EditAttributeDialog from "./EditAttributeDialog";

interface MyAccountProps {
  onEditProfile?: () => void;
}

const MyAccount = ({ onEditProfile }: MyAccountProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [disableAccountOpen, setDisableAccountOpen] = useState(false);
  const [editDisplayNameOpen, setEditDisplayNameOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);

  return (
    <div className="w-full h-full text-[#b5bac1]">
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
        My Account
      </h2>
      <p className="text-sm text-[#949ba4] mb-6">
        Manage your account information and settings
      </p>

      {/* Banner & Avatar Card */}
      <div className="bg-[#111214] rounded-lg overflow-hidden mb-8 relative group shadow-sm border border-[#1e1f22]">
        {/* Banner */}
        <div className="h-[100px] bg-[#1e1f22] relative group/banner cursor-pointer" onClick={onEditProfile}>
          {user?.bannerUrl ? (
            <img
              src={user.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#3e4147]" /> // Solid fallback color close to screenshot
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-semibold">CHANGE BANNER</span>
          </div>
        </div>


        {/* Avatar */}
        <div className="absolute top-[72px] left-[16px]">
          <div className="relative w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#111214] overflow-hidden group/avatar cursor-pointer" onClick={onEditProfile}>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-[#5865f2] text-white text-3xl font-medium">
                {(user?.username?.[0] || "U").toUpperCase()}
              </div>
            )}
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">CHANGE AVATAR</span>
            </div>
            <div className="absolute bottom-[2px] right-[2px] w-6 h-6 bg-[#23a559] border-[3px] border-[#111214] rounded-full" />
          </div>
        </div>

        {/* User Info Header: Name & Edit Profile Button */}
        <div className="pt-4 pr-4 pl-[110px] pb-4 flex justify-between items-start min-h-[70px]">
          <div>
            <div className="text-xl font-bold text-white leading-tight">
              {user?.username || "Username"}
            </div>
             <div className="text-sm text-[#b5bac1] leading-tight">
              {user?.username || "username"}
            </div>
            {/* Badges Placeholder */}
             <div className="flex gap-1 mt-2">
                 <div className="w-5 h-5 bg-[#5865f2] rounded flex items-center justify-center text-[10px] text-white font-bold" title="HypeSquad Brilliance">
                    B
                 </div>
                 <div className="w-5 h-5 bg-[#f0b232] rounded flex items-center justify-center text-[10px] text-white font-bold" title="Early Supporter">
                    S
                 </div>
             </div>
          </div>
          
          <button
            onClick={onEditProfile}
            className="px-4 py-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded transition-colors"
          >
            Edit User Profile
          </button>
        </div>

        {/* Info Fields Container - Darker Inset */}
        <div className="p-4 bg-[#2f3136] m-4 rounded-lg space-y-1">
          {/* Display Name */}
          <div className="flex justify-between items-center py-3">
             <div className="flex-1">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-1">Display Name</h3>
              <div className="text-white text-sm">{user?.firstName || user?.username}</div>
            </div>
            <button 
              onClick={() => setEditDisplayNameOpen(true)}
              className="px-5 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded transition-colors"
            >
              Edit
            </button>
          </div>
          
          {/* Username */}
          <div className="flex justify-between items-center py-3">
             <div className="flex-1">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-1">Username</h3>
              <div className="text-white text-sm">{user?.username}</div>
            </div>
            <button 
              onClick={() => setEditUsernameOpen(true)}
              className="px-5 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center py-3">
             <div className="flex-1">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-1">Email</h3>
              <div className="text-white text-sm flex items-center gap-2">
                {user?.email
                  ? user.email.replace(/(.{2})(.*)(@.*)/, "$1****$3")
                  : "********@***.com"}
                <span className="text-[#00a8fc] text-xs cursor-pointer hover:underline font-medium">
                  Reveal
                </span>
              </div>
            </div>
            <button className="px-5 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded transition-colors">
              Edit
            </button>
          </div>

          {/* Phone Number */}
          <div className="flex justify-between items-center py-3">
             <div className="flex-1">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-1">Phone Number</h3>
              <div className="text-white text-sm flex items-center gap-2">
                ********5840
                <span className="text-[#00a8fc] text-xs cursor-pointer hover:underline font-medium">
                  Reveal
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-[#b5bac1] hover:underline text-xs font-medium px-2">
                 Remove
              </button>
              <button className="px-5 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded transition-colors">
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

       {/* Edit Dialogs */}
      <EditAttributeDialog
        open={editDisplayNameOpen}
        onOpenChange={setEditDisplayNameOpen}
        title="Change Display Name"
        label="Display Name"
        description="Enter a new display name."
        initialValue={user?.firstName || user?.username || ""}
        fieldName="firstName"
        user={user}
      />
      <EditAttributeDialog
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        title="Change Username"
        label="Username"
        description="Enter a new username."
        initialValue={user?.username || ""}
        fieldName="username"
        user={user}
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
