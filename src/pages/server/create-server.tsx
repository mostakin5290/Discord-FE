import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/upload";
import { Trash } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { createNewServer } from "@/store/slices/serverSlice";
import { toast } from "sonner";

import { useDropzone } from "react-dropzone";

const CreateServer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

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
      await dispatch(
        createNewServer({
          name: name,
          imageUrl: image,
          bio: desc,
        })
      ).unwrap();

      toast.success("Server created successfully!");
      navigate("/channels/@me");
    } catch (error: any) {
      toast.error(error || "Failed to create server");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#2b3351]">
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Server</DialogTitle>
              <DialogDescription>
                Create First ever server here!. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pt-5">
              <div className="grid gap-3">
                <Label htmlFor="name">Server Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name your server here!"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Server Description</Label>
                <Textarea
                  className="h-30"
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
        ${
          isDragActive
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
                      <Spinner />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={uploadServerCoverImg}
                      className="absolute bottom-26 left-36 px-10"
                      disabled={!file || loading}
                    >
                      upload
                    </Button>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="pt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={!image || !name || !desc || submitLoading}
                type="submit"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateServer;
