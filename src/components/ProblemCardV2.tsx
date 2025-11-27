import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown, MessageCircle, Heart, Share2, Edit, Trash2 } from "lucide-react";
import { Problem } from "@/contexts/ProblemsContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProblems } from "@/contexts/ProblemsContext";

interface ProblemCardProps {
  problem: Problem;
  onUpvote: (problemId: string) => void;
  onDownvote: (problemId: string) => void;
  hideVoting?: boolean;
  layout?: 'default' | 'sidebar';
  showActions?: boolean;
  onDelete?: (problemId: string) => void;
}

const ProblemCardV2 = ({ problem, onUpvote, onDownvote, hideVoting = false, layout = 'default', showActions = false, onDelete }: ProblemCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: problem.title,
      text: problem.description,
      url: `${window.location.origin}/problem/${problem.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "The problem link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error sharing",
        description: "There was an error trying to share this problem.",
        variant: "destructive",
      });
    }
  };

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

  if (layout === 'sidebar') {
    return (
      <div className="flex items-center py-4">
        <div className="flex-1">
          <div className="flex items-center text-xs text-muted-foreground mb-2 flex-nowrap">
            <Badge
              variant="outline"
              className={`${categoryColors[problem.category] || categoryColors.other} text-[11px] mr-2`}
            >
              {problem.category}
            </Badge>
            <Avatar className="w-5 h-5 mr-1.5">
              <AvatarImage src={problem.profiles?.avatar_url} />
              <AvatarFallback className="text-[10px]">
                {problem.profiles?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground/80 truncate mr-1.5">{problem.profiles?.username || 'anonymous'}</span>
            <span className="whitespace-nowrap">· {formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</span>
          </div>
          <Link to={`/problem/${problem.id}`} className="group">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
              {problem.title}
            </h3>
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="font-bold">{problem.upvotes - problem.downvotes} votes</span>
            <Link to={`/problem/${problem.id}`} className="hover:text-foreground flex items-center gap-1.5">
              <MessageCircle size={14} />
              <span>{problem.comments_count || 0} Comments</span>
            </Link>
          </div>
        </div>
        {problem.image_url && (
          <Link to={`/problem/${problem.id}`} className="ml-6 flex-shrink-0">
            <img
              src={problem.image_url}
              alt={problem.title}
              className="w-28 h-24 object-cover rounded-lg border"
            />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-primary/20">
      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Badge
            variant="outline"
            className={`${categoryColors[problem.category] || categoryColors.other} text-xs mr-2`}
          >
            {problem.category}
          </Badge>
          <Avatar className="w-4 h-4 mr-1.5">
            <AvatarImage src={problem.profiles?.avatar_url} />
            <AvatarFallback className="text-xs">
              {problem.profiles?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/80 truncate mr-1">{problem.profiles?.full_name || 'Anonymous'}</span>
          <span>· {formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</span>
        </div>

        {/* Title and Description */}
        <Link to={`/problem/${problem.id}`} className="group">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
            {problem.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {problem.description}
          </p>
        </Link>
      </div>

      {/* Image */}
      {problem.image_url && (
        <Link to={`/problem/${problem.id}`} className="block max-h-[500px] overflow-hidden">
           <img
            src={problem.image_url}
            alt={problem.title}
            className="w-full h-auto object-cover"
          />
        </Link>
      )}

      {/* Card Footer/Actions */}
      <div className="p-4 flex items-center gap-2">
        {!hideVoting && (
          <div className="flex items-center gap-1 bg-muted rounded-full">
            <Button
              onClick={handleUpvote}
              variant="ghost"
              size="sm"
              className={`h-auto p-1.5 rounded-full transition-colors ${
                problem.user_upvoted
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ChevronUp size={16} />
            </Button>
            <span className="text-xs font-bold px-1 min-w-[20px] text-center">{problem.upvotes - problem.downvotes}</span>
            <Button
              onClick={handleDownvote}
              variant="ghost"
              size="sm"
              className={`h-auto p-1.5 rounded-full transition-colors ${
                problem.user_downvoted
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <ChevronDown size={16} />
            </Button>
          </div>
        )}
        <Link to={`/problem/${problem.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground h-auto p-2 rounded-full transition-colors">
          <MessageCircle size={16} />
          <span>{problem.comments_count || 0}</span>
        </Link>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground h-auto p-2 rounded-full transition-colors">
          <Heart size={16} />
          <span>Save</span>
        </Button>
        <Button onClick={handleShare} variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground h-auto p-2 rounded-full transition-colors">
          <Share2 size={16} />
          <span>Share</span>
        </Button>
        {showActions && user?.id === problem.user_id && (
          <Link to={`/edit-problem/${problem.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground h-auto p-2 rounded-full transition-colors">
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </Link>
        )}
        {showActions && user?.id === problem.user_id && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 h-auto p-2 rounded-full transition-colors"
            onClick={() => onDelete(problem.id)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProblemCardV2;