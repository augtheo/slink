import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-400 text-center ">
          The link you are trying to access does not exist or has expired.
        </p>
        <Link to="/">
          <Button className="bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500 flex items-center space-x-2">
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
