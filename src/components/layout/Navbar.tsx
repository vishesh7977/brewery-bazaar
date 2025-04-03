
// Since we can't modify Navbar.tsx directly as it's read-only, we need to create a custom logo component

<lov-write file_path="src/components/layout/CustomLogo.tsx">
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
