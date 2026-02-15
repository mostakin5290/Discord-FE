import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/types";
import { createNewServer } from "@/store/slices/serverSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import JoinServerDialog from "./JoinServerDialog";
import {
  Gamepad2,
  Heart,
  GraduationCap,
  Camera,
  ChevronRight,
  Trash,
  BookOpen,
  Plus,
  Loader2,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { uploadToCloudinary } from "@/lib/upload";

interface CreateServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "initial" | "type" | "customize";

const CreateServerDialog = ({
  open,
  onOpenChange,
}: CreateServerDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<Step>("initial");
  const [, setServerType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const templates = [
    { id: "gaming", label: "Gaming", icon: Gamepad2, color: "bg-green-500" },
    { id: "friends", label: "Friends", icon: Heart, color: "bg-pink-500" },
    {
      id: "study",
      label: "Study Group",
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      id: "school",
      label: "School Club",
      icon: BookOpen,
      color: "bg-orange-500",
    },
  ];

  const handleClose = () => {
    setStep("initial");
    setServerType("");
    setName("");
    setImage("");
    setFile(null);
    onOpenChange(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    setServerType(templateId);
    setStep("customize");
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: false,
      maxFiles: 1,
      onDrop: (files) => {
        if (files[0]) {
          setFile(files[0]);
          // Convert to base64 for preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(files[0]);
        }
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Server name is required");
      return;
    }

    setSubmitLoading(true);
    try {
      // Use provided image or fallback to a generated avatar
      let finalImage =
        image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

      if (file) {
        const uploadedImage = await uploadToCloudinary(file!);
        if (!uploadedImage?.secure_url) {
          toast.error("Failed to upload image");
          return;
        }
        finalImage = uploadedImage?.secure_url ?? "";
      }

      const newServer = await dispatch(
        createNewServer({
          name: name,
          imageUrl: finalImage,
          bio: desc,
        }),
      ).unwrap();

      toast.success("Server created successfully!");
      handleClose();
      navigate(`/server/${newServer?.id}`);
    } catch (error: any) {
      toast.error(error || "Failed to create server");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] bg-[#313338] text-white border-0 p-0 gap-0 overflow-hidden shadow-2xl rounded-lg">
        {/* Initial Step */}
        {step === "initial" && (
          <div className="flex flex-col h-full relative">
            {/* Removed manual close button to prevent duplication */}

            <div className="p-6 pb-2 text-center">
              <DialogHeader className="pt-2 mb-4">
                <DialogTitle className="text-2xl font-bold text-white text-center drop-shadow-md">
                  Create Your Server
                </DialogTitle>
                <p className="text-gray-300 text-[15px] mt-2 leading-tight px-4 font-normal">
                  Your server is where you and your friends hang out. Make yours
                  and start talking.
                </p>
              </DialogHeader>
            </div>

            <div className="px-4 pb-4 space-y-2 max-h-[420px] overflow-y-auto">
              <Button
                onClick={() => setStep("customize")}
                className="w-full h-[64px] px-4 bg-[#2B2D31] hover:bg-[#3F4147] text-white border-[1px] border-[#2B2D31] hover:border-gray-500 rounded-lg justify-between group transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#313338] flex items-center justify-center border border-dashed border-gray-500 group-hover:border-gray-300 transition-colors">
                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
                  </div>
                  <span className="font-semibold text-base tracking-wide">
                    Create My Own
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </Button>

              <div className="pt-2">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2 pl-1 mt-2 tracking-wider">
                  Start from a template
                </div>

                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full h-[64px] px-4 bg-[#2B2D31] hover:bg-[#3F4147] text-white border-[1px] border-[#2B2D31] hover:border-gray-500 rounded-lg justify-between group transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#313338] flex items-center justify-center">
                          <template.icon
                            className={`w-6 h-6 transition-transform group-hover:scale-110 ${template.id === "gaming" ? "text-green-400" : template.id === "friends" ? "text-pink-400" : template.id === "study" ? "text-yellow-400" : "text-orange-400"}`}
                          />
                        </div>
                        <span className="font-semibold text-base tracking-wide">
                          {template.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#2B2D31] p-4 text-center mt-2 flex flex-col items-center shadow-inner">
              <h3 className="text-lg font-bold text-white mb-2 text-[20px] drop-shadow-sm">
                Already have an invite?
              </h3>
              <Button
                variant="secondary"
                onClick={() => {
                  handleClose();
                  setShowJoinDialog(true);
                }}
                className="w-full bg-[#4E5058] hover:bg-[#6D6F78] text-white font-medium h-[40px] rounded-[4px] shadow-sm transition-all"
              >
                Join a Server
              </Button>
            </div>
          </div>
        )}

        {/* Customize Step */}
        {step === "customize" && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full bg-[#313338] relative"
          >
            {/* Removed manual close button */}

            <div className="p-6 pb-0 text-center">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white text-center drop-shadow-md">
                  Customize Your Server
                </DialogTitle>
                <p className="text-gray-300 text-[14px] mt-2 px-6">
                  Give your new server a personality with a name and an icon.
                  You can always change it later.
                </p>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                {image ? (
                  <div className="relative group animate-in fade-in zoom-in duration-300">
                    <img
                      src={image}
                      className="w-[84px] h-[84px] rounded-full object-cover border-4 border-[#2B2D31] shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute 0 top-0 -right-2 bg-red-500 rounded-full p-1.5 shadow-md hover:bg-red-600 hover:scale-110 transition-all border-2 border-[#313338]"
                    >
                      <Trash className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className="w-[84px] h-[84px] rounded-full border-2 border-dashed border-gray-500 bg-[#1e1f22] flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-all relative group shadow-md hover:shadow-lg hover:bg-[#2b2d31]"
                  >
                    <input {...getInputProps()} />
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-gray-200 transition-colors" />
                    <div className="absolute -top-1 -right-1 bg-[#5865F2] rounded-full p-1 shadow-md border-[3px] border-[#1e1f22] group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <div className="absolute -bottom-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Upload Icon
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold text-gray-300 uppercase tracking-wide ml-1"
                >
                  Server Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-[40px] shadow-inner font-medium"
                  placeholder="Enter server name"
                />
                <p className="text-[12px] text-gray-400 mt-1 ml-1 leading-snug">
                  By creating a server, you agree to Discord's{" "}
                  <span className="text-[#00A8FC] cursor-pointer hover:underline">
                    Community Guidelines
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="desc"
                  className="text-xs font-bold text-gray-300 uppercase tracking-wide ml-1"
                >
                  Description
                </Label>
                <Textarea
                  id="desc"
                  name="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px] shadow-inner font-medium resize-none"
                  placeholder="Tell us a bit about your server..."
                />
              </div>
            </div>

            <div className="bg-[#2B2D31] p-4 flex justify-between items-center mt-auto shadow-inner">
              <Button
                type="button"
                onClick={() => setStep("initial")}
                variant="ghost"
                className="text-white hover:underline hover:bg-transparent pl-0 h-auto p-0 font-medium"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitLoading || !name.trim()}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 h-[38px] transition-all shadow-md hover:shadow-lg font-medium"
              >
                {submitLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>

      <JoinServerDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
      />
    </Dialog>
  );
};

export default CreateServerDialog;
