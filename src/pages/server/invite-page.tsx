import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { joinServerWithCode } from "@/store/slices/serverSlice";
import type { AppDispatch, RootState } from "@/store/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const InvitePage = () => {
    const { serverId, invitecode } = useParams<{ serverId: string, invitecode: string }>();
    const { isLoading, error } = useSelector((state: RootState) => state.server);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (invitecode && serverId) {
            dispatch(joinServerWithCode(invitecode))
                .unwrap()
                .then((data) => {
                    toast.success(data.message);
                    navigate(`/server/${serverId}`);
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    }, [invitecode, serverId, dispatch, navigate]);

    if (error) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#313338]">
                <LoadingSpinner message="Failed to join server" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#313338]">
            {isLoading ? (
                <div>
                    <LoadingSpinner message="Joining server..." />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-[#313338]">
                    <LoadingSpinner message="Failed to join server" />
                </div>
            )}
        </div>
    );
};

export default InvitePage;