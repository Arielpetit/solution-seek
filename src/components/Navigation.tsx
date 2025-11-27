import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, LogOut, Settings, Bell, LayoutGrid, Check, Moon, Sun, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

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

  return (
    <nav className="fixed top-0 right-0 z-30 w-full bg-card border-b border-border shadow-card">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/problemhub.png" alt="ProblemHub Logo" className="w-32 h-32" />
          </div>
          <div className="flex-1 flex justify-center px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search in ProblemHub"
                className="pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light2")}>
                  Light 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <NotificationPanel
                      notifications={notifications}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                    />
                  </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center p-2">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

const NotificationPanel = ({ notifications, onMarkAsRead, onMarkAllAsRead }: { notifications: Notification[], onMarkAsRead: (id: string) => void, onMarkAllAsRead: () => void }) => {
  const getNotificationMessage = (notification: Notification) => {
    switch(notification.type) {
      case 'new_comment':
        return `New comment on your problem: "${notification.data.problem_title}"`;
      case 'new_solution':
        return `New solution for your problem: "${notification.data.problem_title}"`;
      case 'collaboration_request':
        return `New collaboration request for your solution: "${notification.data.solution_title}"`;
      case 'collaboration_accepted':
        return `Your collaboration request for "${notification.data.solution_title}" was accepted.`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center pb-2 border-b">
        <h4 className="font-medium">Notifications</h4>
        <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>Mark all as read</Button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map(n => (
            <div key={n.id} className={`p-2 rounded-lg flex items-start gap-3 ${!n.is_read ? 'bg-blue-500/10' : ''}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={n.profiles?.avatar_url} />
                <AvatarFallback>{n.profiles?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{n.profiles?.full_name}</span> {getNotificationMessage(n)}
                </p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
              </div>
              {!n.is_read && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMarkAsRead(n.id)}>
                  <Check size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};