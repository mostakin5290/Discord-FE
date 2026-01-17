import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#131725] text-white p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6"
          >
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="px-6">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
