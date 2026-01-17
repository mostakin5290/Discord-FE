import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
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

  const handleFileChange = (file: File, type: "banner" | "avatar") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        if (type === "banner") setBannerUrl(result);
        else setImageUrl(result);
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
      await dispatch(
        updateUserProfile({
          id: user.id,
          bannerUrl,
          imageUrl,
          bio,
        }),
      ).unwrap();

      toast.success("Profile updated!");
      setIsDirty(false);
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
            <label className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
              Banner
            </label>
            <div
              {...getBannerRootProps()}
              className="relative w-full h-[120px] rounded-lg overflow-hidden cursor-pointer group bg-[#1e1f22] border-2 border-dashed border-[#3f4147] hover:border-[#5865f2] transition-all duration-300"
            >
              <input {...getBannerInputProps()} />
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[#111214]">
                  <Upload className="w-8 h-8 text-[#949ba4] mb-2" />
                  <span className="text-sm text-[#949ba4]">
                    Click to upload banner
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold px-4 py-2 bg-[#5865f2] rounded-md flex items-center gap-2 shadow-lg">
                  <Upload size={16} /> Change Banner
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div
              {...getAvatarRootProps()}
              className="relative w-[80px] h-[80px] rounded-full overflow-hidden cursor-pointer group bg-[#1e1f22] border-4 border-[#313338] hover:border-[#5865f2] transition-all duration-300 shadow-lg"
            >
              <input {...getAvatarInputProps()} />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#5865f2] to-[#4752c4] text-white text-2xl font-bold">
                  {(user?.username?.[0] || "U").toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold uppercase text-center leading-tight">
                  Change
                  <br />
                  Avatar
                </span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-white font-semibold block mb-2">
                Avatar
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getAvatarRootProps().onClick?.(e as any);
                }}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Change Avatar
              </button>
            </div>
          </div>

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
              className="w-full h-[120px] bg-[#1e1f22] text-[#dbdee1] p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5865f2] resize-none scrollbar-thin scrollbar-thumb-[#111214] border border-[#3f4147] hover:border-[#5865f2]/50 transition-colors"
              placeholder="Tell the world a little bit about yourself..."
              maxLength={190}
            />
          </div>
        </div>

        {/* Actions Footer */}
        {isDirty && (
          <div
            className="fixed bottom-6 left-[218px] right-6 p-4 bg-[#111214] flex items-center justify-between rounded-lg shadow-2xl animate-in slide-in-from-bottom-4 fade-in border border-[#1e1f22]"
            style={{ marginLeft: "218px" }}
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
          <h3 className="uppercase text-xs font-bold text-[#949ba4] mb-4 tracking-wide">
            Preview
          </h3>

          {/* Preview Card */}
          <div className="w-[300px] bg-[#111214] rounded-lg overflow-hidden shadow-2xl border border-[#1a1b1e]">
            {/* Banner */}
            <div className="h-[120px] w-full bg-gradient-to-br from-[#5865f2] to-[#3b47d4]">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#5865f2] to-[#3b47d4]" />
              )}
            </div>

            {/* Avatar (positioned over banner) */}
            <div className="absolute -mt-10 left-[16px]">
              <div className="w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#111214] overflow-hidden relative shadow-xl ring-2 ring-[#1a1b1e]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#5865f2] to-[#4752c4] text-white text-2xl font-bold">
                    {(user?.username?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#23a559] border-[3px] border-[#111214] rounded-full shadow-lg" />
              </div>
            </div>

            {/* User Info Card Content */}
            <div className="pt-[50px] pb-4 px-4 bg-[#111214] min-h-[200px] rounded-b-lg">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {user?.username || "Username"}
                </h3>
                <span className="text-sm text-[#b5bac1] font-medium">
                  {user?.username || "username"}
                </span>
              </div>

              <hr className="border-[#2f3136] mb-3" />

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
                  About Me
                </h4>
                <p className="text-sm text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                  {bio || "Your bio will appear here..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
