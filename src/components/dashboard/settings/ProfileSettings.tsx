import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { updateUserProfile } from "@/store/slices/authSlice";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const [bannerUrl, setBannerUrl] = useState(user?.bannerUrl || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isDirty, setIsDirty] = useState(false);

  // Sync with user state on mount or change (unless dirty)
  useEffect(() => {
    if (!isDirty && user) {
      setBannerUrl(user.bannerUrl || "");
      setImageUrl(user.imageUrl || "");
      setBio(user.bio || "");
    }
  }, [user, isDirty]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Sync local state with Redux user when it changes (e.g. after save)
  useEffect(() => {
    if (user) {
      if (!isDirty) {
        setBannerUrl(user.bannerUrl || "");
        setImageUrl(user.imageUrl || "");
        setBio(user.bio || "");
      }
    }
  }, [user, isDirty]);

  const handleFileChange = (file: File, type: "banner" | "avatar") => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        if (type === "banner") {
          setBannerUrl(result);
          setBannerFile(file);
        } else {
          setImageUrl(result);
          setAvatarFile(file);
        }
        setIsDirty(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDropBanner = (acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) handleFileChange(acceptedFiles[0], "banner");
  };

  const onDropAvatar = (acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) handleFileChange(acceptedFiles[0], "avatar");
  };

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
  } = useDropzone({
    onDrop: onDropBanner,
    accept: { "image/*": [] },
    multiple: false,
  });

  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
  } = useDropzone({
    onDrop: onDropAvatar,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSave = async () => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (user.username) formData.append("username", user.username);
      if (user.firstName) formData.append("firstName", user.firstName);
      if (user.lastName) formData.append("lastName", user.lastName);
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      await dispatch(updateUserProfile(formData)).unwrap();

      toast.success("Profile updated!");
      setIsDirty(false);
      setAvatarFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleReset = () => {
    setIsDirty(false);
    if (user) {
      setBannerUrl(user.bannerUrl || "");
      setImageUrl(user.imageUrl || "");
      setBio(user.bio || "");
    }
  };

  return (
    <div className="flex w-full h-full text-[#b5bac1]">
      {/* Left Column: Edit Form */}
      <div className="flex-1 pr-8">
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          User Profile
        </h2>
        <p className="text-sm text-[#949ba4] mb-6">
          Customize how your profile looks to others
        </p>

        <div className="space-y-6">
          {/* Banner Upload */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
                Banner
              </label>
            </div>
            <div
              {...getBannerRootProps()}
              className="relative w-full h-[120px] rounded-lg overflow-hidden cursor-pointer group bg-[#1e1f22] shadow-sm border border-[#1e1f22] hover:border-[#2f3136] transition-all"
            >
              <input {...getBannerInputProps()} />
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[#1e1f22]">
                  <Upload className="w-8 h-8 text-[#b5bac1] mb-2" />
                  <span className="text-sm text-[#949ba4] font-medium">
                    Upload Banner
                  </span>
                  <span className="text-xs text-[#5e626c] mt-1">
                    Minimum Size: 600x240
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors">
                    <Upload className="w-4 h-4 text-white" />
                 </div>
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5 pt-2">
            <div
              {...getAvatarRootProps()}
              className="relative w-[80px] h-[80px] rounded-full overflow-hidden cursor-pointer group bg-[#1e1f22] ring-4 ring-[#1e1f22] shadow-md"
            >
              <input {...getAvatarInputProps()} />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-[#5865f2] text-white text-2xl font-bold">
                  {(user?.username?.[0] || "U").toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold uppercase text-center leading-tight drop-shadow-md">
                  Change
                </span>
              </div>
            </div>
            <div>
              <button
                onClick={(e) => {
                   e.stopPropagation();
                   getAvatarRootProps().onClick?.(e as any);
                }}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium rounded transition-all shadow-sm"
              >
                Change Avatar
              </button>
              <p className="text-xs text-[#949ba4] mt-2">
                  recommends an image of at least 256x256.
              </p>
            </div>
          </div>
          
          <hr className="border-[#2f3136]" />

          {/* Bio Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide flex justify-between items-center">
              <span>About Me</span>
              <span className="text-[#949ba4] font-normal normal-case">
                {bio.length}/190
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setIsDirty(true);
              }}
              className="w-full h-[120px] bg-[#1e1f22] text-[#dbdee1] p-3 rounded-md text-sm focus:outline-none focus:bg-[#1e1f22] resize-none scrollbar-thin scrollbar-thumb-[#111214] border-none placeholder:text-[#5c5e66] font-medium"
              placeholder="Tell the world a little bit about yourself..."
              maxLength={190}
            />
             <p className="text-xs text-[#949ba4]">
                You can use markdown and links if you'd like.
             </p>
          </div>
        </div>

        {/* Actions Footer */}
        {isDirty && (
          <div
            className="fixed bottom-6 left-[240px] right-6 p-4 bg-[#111214] flex items-center justify-between rounded-lg shadow-2xl animate-in slide-in-from-bottom-4 fade-in border border-[#1e1f22] z-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0b232]/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <span className="text-white font-semibold">
                Careful - you have unsaved changes!
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 hover:underline text-white text-sm font-semibold transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-[#23a559] hover:bg-[#1e8f4e] text-white text-sm font-bold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Preview */}
      <div className="w-[300px] shrink-0">
        <div className="sticky top-0">
          <h3 className="uppercase text-xs font-bold text-[#b5bac1] mb-4 tracking-wide">
            Preview
          </h3>

          {/* Preview Card (User Popout Style) */}
          <div className="w-[300px] bg-[#111214] rounded-lg overflow-hidden shadow-xl border border-[#1e1f22]">
            {/* Banner */}
            <div className="h-[120px] w-full bg-[#1e1f22] relative group">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#5865f2]" /> // Default to a solid color
              )}
            </div>

            {/* Avatar (positioned over banner) */}
            <div className="absolute top-[80px] left-[16px]">
              <div className="w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#111214] overflow-hidden relative shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#5865f2] text-white text-3xl font-medium">
                    {(user?.username?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-[2px] right-[2px] w-6 h-6 bg-[#23a559] border-[3px] border-[#111214] rounded-full" />
              </div>
            </div>

            {/* User Info Card Content */}
            <div className="pt-[58px] pb-4 px-4 bg-[#111214] min-h-[200px] rounded-b-lg">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {user?.username || "Username"}
                </h3>
                <span className="text-sm text-[#b5bac1] font-medium">
                  {user?.username || "username"}
                </span>
              </div>

              <hr className="border-[#2f3136] mb-3" />

              {/* About Me Section in Preview */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
                  About Me
                </h4>
                <div className="text-sm text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                  {bio || "Your bio will appear here..."}
                </div>
              </div>

              {/* Fake Roles or Note for fidelity */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
                  Member Since
                </h4>
                <div className="text-xs text-[#dbdee1]">
                  Jan 19, 2026
                </div>
              </div>

               {/* Fake Message Input */}
               <div className="mt-4">
                  <div className="bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#73767d] cursor-not-allowed">
                    Message @{user?.username}...
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
