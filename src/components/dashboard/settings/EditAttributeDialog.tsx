import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/types";
import { updateUserProfile } from "@/store/slices/authSlice";
import { toast } from "sonner";

interface EditAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label: string;
  initialValue: string;
  fieldName: "firstName" | "username" | "email"; // specific fields we support
  user: any; // Using any for simplicity, but preferably typed
}

const EditAttributeDialog = ({
  open,
  onOpenChange,
  title,
  description,
  label,
  initialValue,
  fieldName,
  user
}: EditAttributeDialogProps) => {
  const [value, setValue] = useState(initialValue);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setPassword("");
    }
  }, [open, initialValue]);

  const handleSave = async () => {
    if (value === initialValue) {
      onOpenChange(false);
      return;
    }
    
    if (!value.trim()) {
        toast.error(`${label} cannot be empty`);
        return;
    }

    // For username/email changes, we typically require password, but for now we'll skip it based on current backend implementation
    // If backend requires password for sensitive changes, we'd add it here.
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append(fieldName, value);
      
      // We must append other required fields if the backend replaces the whole object, 
      // but updateUserProfile uses PATCH/partial logic in the controller usually?
      // Actually, looking at auth.controller.ts, it extracts specifics from req.body.
      // Ideally we should send what changed.
      
      // Wait, updateUserProfile thunk accepts FormData OR partial object.
      // Let's use specific object to be cleaner if possible, but the thunk type says Partial<User> | FormData.
      // Let's stick to object for text fields.
      
      const updateData: any = { [fieldName]: value };
      
      await dispatch(updateUserProfile(updateData)).unwrap();
      
      toast.success(`${label} updated successfully!`);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#313338] text-[#dbdee1] border-none shadow-lg max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-white text-center">
            {title}
          </DialogTitle>
          {description && (
             <DialogDescription className="text-center text-[#949ba4]">
                {description}
             </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-[#1e1f22] text-white p-2.5 rounded border-none focus:ring-2 focus:ring-[#00a8fc] outline-none font-medium text-sm"
              autoFocus
            />
          </div>
          
          {/* We could add Password field here if needed for critical updates */}
        </div>

        <DialogFooter className="bg-[#2b2d31] p-4 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-white hover:underline text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold rounded-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Done" : "Done"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttributeDialog;
