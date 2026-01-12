import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setCreateChannelModelOpen } from "@/store/slices/modalSlice";
import { createChannel, fetchServerById } from "@/store/slices/serverSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ChannelTypes = [
    { id: "TEXT", label: "Text" },
    { id: "AUDIO", label: "Audio" },
    { id: "VIDEO", label: "Video" },
] as const;

export function CreateChannelModal({ serverId }: { serverId: string }) {
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<typeof ChannelTypes[number]["id"]>("TEXT");

    const dispatch = useDispatch<AppDispatch>();

    const createChannelModalOpen = useSelector((state: RootState) => state.modal.createChannelModalOpen);

    const handleOpenChange = () => {
        dispatch(setCreateChannelModelOpen());
    }

    const { isLoading: isCreateChannelLoading } = useSelector((state: RootState) => state.server);

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        dispatch(createChannel({ serverId, name, type }))
            .unwrap()
            .then(() => {
                toast.success("Channel created successfully");
                // Refetch server to get updated channels list
                dispatch(fetchServerById(serverId));
                handleOpenChange();
                setName("");
                setType("TEXT");
            })
            .catch((error: any) => {
                toast.error(error || "Failed to create channel");
            });
    };

    return (
        <Dialog open={createChannelModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                    <DialogDescription>
                        Create a new channel for your server.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="username-1">Channel Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value as typeof ChannelTypes[number]["id"])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a channel type" />
                            </SelectTrigger>
                            <SelectContent>
                                {ChannelTypes.map((channelType) => (
                                    <SelectItem key={channelType.id} value={channelType.id}>
                                        {channelType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit} disabled={isCreateChannelLoading || !name.trim() || !type}>Create Channel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
