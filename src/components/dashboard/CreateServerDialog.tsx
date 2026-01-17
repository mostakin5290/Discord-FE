import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
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
import { uploadToCloudinary } from "@/lib/upload";
import { useDropzone } from "react-dropzone";
import JoinServerDialog from "./JoinServerDialog";
import {
  Gamepad2,
  Heart,
  GraduationCap,
  Briefcase,
  Camera,
  ChevronRight,
  ChevronLeft,
  X,
  Trash,
} from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const templates = [
    { id: "gaming", label: "Gaming", icon: Gamepad2, color: "bg-green-500" },
    { id: "friends", label: "Friends", icon: Heart, color: "bg-pink-500" },
    {
      id: "study",
      label: "Study Group",
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    { id: "work", label: "Work", icon: Briefcase, color: "bg-purple-500" },
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
        setFile(files[0]);
      },
    });

  const uploadServerCoverImg = async () => {
    setLoading(true);
    const res = await uploadToCloudinary(file!);
    setImage(res?.secure_url ?? "");
    setFile(null);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !image) {
      toast.error("Server name and image are required");
      return;
    }

    setSubmitLoading(true);
    try {
      const newServer = await dispatch(
        createNewServer({
          name: name,
          imageUrl: image,
          bio: desc,
        })
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
      <DialogContent className="sm:max-w-[440px] bg-white p-0 gap-0 overflow-hidden">
        {/* Initial Step */}
        {step === "initial" && (
          <div className="p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>

            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Create Your Server
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                Your server is where you and your friends hang out. Make yours
                and start talking.
              </p>
            </DialogHeader>

            <div className="space-y-2">
              <Button
                onClick={() => setStep("customize")}
                className="w-full h-auto py-4 px-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-lg justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-dashed border-gray-400 flex items-center justify-center group-hover:border-green-500">
                    <Camera className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-semibold">Create My Own</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>

              <div className="py-3">
                <div className="text-xs font-bold text-gray-500 uppercase text-center mb-3">
                  Start from a template
                </div>

                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full h-auto py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${template.color} flex items-center justify-center`}
                        >
                          <template.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{template.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Already have an invite?
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  handleClose();
                  setShowJoinDialog(true);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 border-0"
              >
                Join a Server
              </Button>
            </div>
          </div>
        )}

        {/* Type Selection Step */}
        {step === "type" && (
          <div className="p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>

            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Tell Us More About Your Server
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                In order to help you with your setup, is your new server for
                just a few friends or a larger community?
              </p>
            </DialogHeader>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  setServerType("friends");
                  setStep("customize");
                }}
                className="w-full h-auto py-4 px-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-lg justify-between"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <span className="font-semibold">For me and my friends</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>

              <Button
                onClick={() => {
                  setServerType("community");
                  setStep("customize");
                }}
                className="w-full h-auto py-4 px-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-lg justify-between"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                  <span className="font-semibold">For a club or community</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setStep("customize")}
                className="text-sm text-blue-600 hover:underline"
              >
                Not sure? You can skip this question for now.
              </button>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setStep("initial")}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Customize Step */}
        {step === "customize" && (
          <form onSubmit={handleSubmit} className="p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>

            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Customise Your Server
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                Give your new server a personality with a name and an icon. You
                can always change it later.
              </p>
            </DialogHeader>

            <div className="grid gap-4 pt-5 text-neutral-800">
              <div className="grid gap-3">
                <Label htmlFor="name">Server Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  className="bg-white placeholder:text-neutral-800"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name your server here!"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Server Description</Label>
                <Textarea
                  className="h-30 bg-white placeholder:text-neutral-800"
                  id="description"
                  name="description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe your server here!"
                />
              </div>

              {image ? (
                <div className="grid gap-3 relative">
                  <Label htmlFor="description">Server Image</Label>
                  <img src={image} className="rounded-[10px]" />
                  <Button
                    type="button"
                    onClick={() => setImage("")}
                    className="bg-red-500 hover:bg-red-600 absolute top-10 right-5 px-10"
                  >
                    <Trash />
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Label htmlFor="description">Server Image</Label>
                  <div
                    {...getRootProps()}
                    className={`
        flex flex-col relative items-center justify-center
        rounded-xl border-2 border-dashed
        p-10 text-center cursor-pointer
        transition-all duration-200 h-50 ease-in-out
        ${isDragActive
                        ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                        : "border-zinc-300 hover:border-zinc-400"
                      }
        ${isDragReject ? "border-red-500 bg-red-500/10" : ""}
      `}
                  >
                    <input {...getInputProps()} />
                    {isDragActive
                      ? "Drop files here..."
                      : "Drag & drop files here, or click to select"}
                  </div>
                  {loading ? (
                    <Button
                      type="button"
                      className="absolute bottom-26 left-47 px-10"
                    >
                      <Spinner className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={uploadServerCoverImg}
                      className="absolute bottom-26 left-36 px-10 bg-blue-500 text-white"
                      disabled={!file || loading}
                    >
                      upload
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                onClick={() => setStep("initial")}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitLoading || !name.trim()}
                className="hover:bg-blue-700 bg-blue-500 text-black px-8 text-white"
              >
                {submitLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>

      {/* Join Server Dialog */}
      <JoinServerDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
      />
    </Dialog>
  );
};

export default CreateServerDialog;
