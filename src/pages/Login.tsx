
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { sampleUser, sampleAdmin } from "@/lib/data";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would authenticate against a backend
    // For demo purposes, we'll simulate a successful login after a delay
    setTimeout(() => {
      setLoading(false);
      
      // Demo login validation
      if (email === sampleUser.email && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back to Brewery!",
        });
        navigate("/");
      } else if (email === sampleAdmin.email && password === "admin") {
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. For demo, use user@test.com / password or admin@test.com / admin",
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Login to Your Account</h1>
          <p className="text-muted-foreground">
            Welcome back! Please enter your credentials to access your account.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
          
          {/* Demo accounts */}
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <h3 className="font-medium mb-2">Demo Accounts</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>User: user@test.com / password</p>
              <p>Admin: admin@test.com / admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
