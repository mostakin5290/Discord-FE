import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#5865f2] mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
