import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, MessageCircle, User, Clock } from "lucide-react";
import { useState } from "react";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  comments: number;
  author: string;
  timeAgo: string;
  isUpvoted?: boolean;
}

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  const [upvotes, setUpvotes] = useState(problem.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(problem.isUpvoted || false);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(upvotes - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);
    }
  };

  const categoryColors: Record<string, string> = {
    finance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    health: "bg-green-500/10 text-green-400 border-green-500/20",
    productivity: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    technology: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    lifestyle: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    other: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-primary transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground leading-tight mb-2">
              {problem.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {problem.description}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <Button
              onClick={handleUpvote}
              variant="ghost"
              size="sm"
              className={`h-auto p-2 flex flex-col items-center transition-colors ${
                isUpvoted 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ChevronUp size={20} />
              <span className="text-sm font-medium">{upvotes}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={categoryColors[problem.category] || categoryColors.other}
            >
              {problem.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User size={12} />
              <span>{problem.author}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{problem.timeAgo}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground h-auto p-2"
          >
            <MessageCircle size={14} />
            <span className="text-xs">{problem.comments}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;