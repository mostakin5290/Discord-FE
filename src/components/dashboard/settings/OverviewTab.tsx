import { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/types";
import { updateServerDetails } from "@/store/slices/serverSlice";
import { uploadToCloudinary } from "@/lib/upload";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

const OverviewTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);

  const [name, setName] = useState(currentServer?.name || "");
  const [bio, setBio] = useState(currentServer?.bio || "");
  const [imageUrl, setImageUrl] = useState(currentServer?.imageUrl || "");
  const [bannerUrl, setBannerUrl] = useState(currentServer?.bannerUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

   const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setBannerFile(file);
          setBannerUrl(URL.createObjectURL(file));
      }
  }

  const handleSave = async () => {
    if (!currentServer?.id) return;
    setIsLoading(true);

    try {
      let uploadedImageUrl = imageUrl;
      let uploadedBannerUrl = bannerUrl;

      if (imageFile) {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
      }
      
      if (bannerFile) {
          uploadedBannerUrl = await uploadToCloudinary(bannerFile);
      }

      await dispatch(
        updateServerDetails({
          serverId: currentServer.id,
          data: {
            name,
            bio,
            imageUrl: uploadedImageUrl,
            bannerUrl: uploadedBannerUrl,
          },
        })
      ).unwrap();

      toast.success("Server settings updated!");
    } catch (error: any) {
      toast.error(error || "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Server Overview</h2>
        
        <div className="flex gap-8">
            <div className="flex-1 space-y-4">
                 {/* Server Name */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#b5bac1] uppercase">
                    Server Name
                    </Label>
                    <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#1e1f22] border-none text-[#dbdee1] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                 {/* Server Bio */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#b5bac1] uppercase">
                    Server Description
                    </Label>
                    <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-[#1e1f22] border-none text-[#dbdee1] focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                    placeholder="Tell us about your server..."
                    />
                </div>
            </div>

             {/* Icon Upload */}
            <div className="flex flex-col items-center gap-2">
                 <Label className="text-xs font-bold text-[#b5bac1] uppercase">
                    Server Icon
                 </Label>
                 <div className="relative group cursor-pointer" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#2B2D31] relative bg-[#1e1f22] flex items-center justify-center">
                          {imageUrl ? (
                             <img src={imageUrl} alt="Server Icon" className="w-full h-full object-cover" /> 
                          ) : (
                              <span className="text-2xl text-[#b5bac1]">{name.charAt(0)}</span>
                          )}
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold text-white uppercase">Change Icon</span>
                           </div>
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
                           <Camera size={14} className="text-black" />
                      </div>
                 </div>
            </div>
        </div>
        
         {/* Banner Upload */}
        <div className="mt-6 space-y-2">
             <Label className="text-xs font-bold text-[#b5bac1] uppercase">
                Server Banner Background
             </Label>
             <div className="w-full h-32 rounded-lg bg-[#1e1f22] relative overflow-hidden group">
                 {bannerUrl ? (
                     <img src={bannerUrl} alt="Server Banner" className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full flex items-center justify-center">
                         <span className="text-[#949ba4] text-sm">Upload a banner image</span>
                     </div>
                 )}
                 
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <label htmlFor="banner-upload" className="cursor-pointer">
                           <Button variant="secondary" size="sm" className="pointer-events-none">Change Banner</Button>
                      </label>
                      <input 
                        id="banner-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleBannerChange}
                       />
                 </div>
             </div>
        </div>

      </div>

      <div className="pt-4 border-t border-[#3f4147] flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#248046] hover:bg-[#1a6334] text-white"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default OverviewTab;
