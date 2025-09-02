import { Button } from "@/components/ui/button";
import { TrendingUp, Plus, User, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ProblemBoard
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "secondary" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Home size={16} />
                <span>Feed</span>
              </Button>
            </Link>
            <Link to="/trending">
              <Button 
                variant={isActive("/trending") ? "secondary" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <TrendingUp size={16} />
                <span>Trending</span>
              </Button>
            </Link>
            <Link to="/post">
              <Button 
                variant={isActive("/post") ? "secondary" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Post Problem</span>
              </Button>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/profile">
              <Button 
                variant={isActive("/profile") ? "secondary" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <User size={16} />
                <span className="hidden sm:block">Profile</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;