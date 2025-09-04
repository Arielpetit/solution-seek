import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown, MessageCircle, User, Clock, Heart, Share2 } from "lucide-react";
import { Problem } from "@/contexts/ProblemsContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProblemCardProps {
  problem: Problem;
  onUpvote: (problemId: string) => void;
  onDownvote: (problemId: string) => void;
}

const ProblemCardV2 = ({ problem, onUpvote, onDownvote }: ProblemCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpvote = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote problems",
        variant: "destructive",
      });
      return;
    }
    onUpvote(problem.id);
  };

  const handleDownvote = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to downvote problems",
        variant: "destructive",
      });
      return;
    }
    onDownvote(problem.id);
  };

  const categoryColors: Record<string, string> = {
    finance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    health: "bg-green-500/10 text-green-400 border-green-500/20",
    productivity: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    technology: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    lifestyle: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    education: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    transport: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    other: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-primary transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link to={`/problem/${problem.id}`} className="group">
              <h3 className="text-lg font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {problem.description}
            </p>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Badge 
                variant="outline" 
                className={categoryColors[problem.category] || categoryColors.other}
              >
                {problem.category}
              </Badge>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={problem.profiles?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {problem.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{problem.profiles?.full_name || 'Anonymous'}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={12} />
                <span>{formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <Button
              onClick={handleUpvote}
              variant="ghost"
              size="sm"
              className={`h-auto p-2 flex flex-col items-center transition-colors ${
                problem.user_upvoted
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ChevronUp size={20} />
            </Button>
            <span className="text-sm font-medium">{problem.upvotes - problem.downvotes}</span>
            <Button
              onClick={handleDownvote}
              variant="ghost"
              size="sm"
              className={`h-auto p-2 flex flex-col items-center transition-colors ${
                problem.user_downvoted
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <ChevronDown size={20} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/problem/${problem.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground h-auto p-2"
              >
                <MessageCircle size={14} />
                <span className="text-xs">{problem.comments_count || 0} comments</span>
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-auto p-2 text-muted-foreground hover:text-foreground">
              <Heart size={14} />
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-2 text-muted-foreground hover:text-foreground">
              <Share2 size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCardV2;