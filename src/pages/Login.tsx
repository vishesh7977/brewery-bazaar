
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, User, LogIn, ArrowRight } from "lucide-react";
import { sampleUser, sampleAdmin } from "@/lib/data";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [navigate]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would authenticate against a backend
    setTimeout(() => {
      setLoading(false);
      
      // Demo login validation
      if (email === sampleUser.email && password === "password") {
        // Store user info in localStorage (in a real app, this would be a JWT token or session)
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userName", sampleUser.name);
        localStorage.setItem("userEmail", sampleUser.email);
        
        toast({
          title: "Login successful",
          description: "Welcome back to Brewery!",
        });
        navigate("/profile");
      } else if (email === sampleAdmin.email && password === "admin") {
        // Store admin info in localStorage
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userName", sampleAdmin.name);
        localStorage.setItem("userEmail", sampleAdmin.email);
        
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background/80 to-background">
      <div className="max-w-md w-full">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-lg p-8 rounded-xl"
            variants={itemVariants}
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-foreground/80">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-border/30 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="flex items-center gap-2 text-foreground/80">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
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
                    className="bg-background/50 border-border/30 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 transition-all group" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Logging in..." : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div variants={itemVariants} className="mt-6">
              <div className="relative flex items-center justify-center my-4">
                <Separator className="absolute w-full" />
                <span className="relative bg-card/40 px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
              </div>
              
              <Button variant="outline" className="w-full" disabled={loading}>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center">
            <div className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign Up
              </Link>
            </div>
            
            {/* Demo accounts */}
            <motion.div 
              variants={itemVariants} 
              className="mt-4 p-4 bg-secondary/40 backdrop-blur-sm rounded-lg border border-border/50"
            >
              <h3 className="flex items-center justify-center font-medium mb-2 text-sm">
                <User className="mr-2 h-4 w-4" />
                Demo Accounts
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>User: user@test.com / password</p>
                <p>Admin: admin@test.com / admin</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
