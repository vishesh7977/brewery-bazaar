
import { Link } from "react-router-dom";

export const CustomLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/5aefe79a-8b57-4e1d-bdf0-4ab6c38fde5b.png" 
        alt="Breckie Store Logo" 
        className="h-10 w-auto" 
      />
    </Link>
  );
};
