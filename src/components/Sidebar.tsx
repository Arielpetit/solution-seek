import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, Plus, User, MessageSquare, LogOut, HelpCircle, Info, FileText, Shield, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  const navLinks = [
    { to: "/", icon: Home, text: "Feed" },
    { to: "/trending", icon: TrendingUp, text: "Trending" },
    { to: "/post", icon: Plus, text: "Post Problem" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  const additionalLinks = [
    { href: "https://wa.me/659143005", icon: MessageSquare, text: "WhatsApp Community" },
    { to: "/help", icon: HelpCircle, text: "Help" },
    { to: "/blog", icon: FileText, text: "Blog" },
    { to: "/about", icon: Info, text: "About ProblemHub" },
    { to: "/rules", icon: FileText, text: "ProblemHub Rules" },
    { to: "/privacy", icon: Shield, text: "Privacy Policy" },
    { to: "/agreement", icon: FileText, text: "User Agreement" },
    { to: "/accessibility", icon: Accessibility, text: "Accessibility" },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col p-4 fixed top-0 left-0">
      <div className="mb-8">
        <Link to="/" className="flex items-center">
          <img src="/problemhub.png" alt="ProblemHub Logo" className="w-10 h-10" />
        </Link>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>
                <Button
                  variant={isActive(link.to) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <link.icon size={16} className="mr-2" />
                  {link.text}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-border" />
        <div className="space-y-2">
            <h2 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
            </h2>
            <ul className="space-y-2">
              {additionalLinks.map((link, index) => {
                const isExternal = 'href' in link;
                const props = {
                  href: isExternal ? link.href : undefined,
                  to: !isExternal ? link.to : undefined,
                  target: isExternal ? "_blank" : undefined,
                  rel: isExternal ? "noopener noreferrer" : undefined,
                };
                const LinkComponent = isExternal ? 'a' : Link;

                return (
                  <React.Fragment key={link.text}>
                    <li>
                      <LinkComponent {...props}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <link.icon size={16} className="mr-2" />
                          {link.text}
                        </Button>
                      </LinkComponent>
                    </li>
                    {link.text === "ProblemHub Rules" && (
                      <hr className="my-2 border-border" />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
        </div>
      </nav>
      <div className="mt-auto">
        {user && (
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        )}
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} ProblemHub. All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;