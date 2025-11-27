import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SolutionChat from '@/components/SolutionChat';
import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  User,
  Clock,
  ArrowLeft,
  Users,
  DollarSign,
  Send,
  Lightbulb,
  Heart,
  Flag,
  Edit
} from 'lucide-react';
import { useProblems } from '@/contexts/ProblemsContext';
import ProblemCardV2 from '@/components/ProblemCardV2';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotify } from '@/hooks/useNotify';
import { formatDistanceToNow } from 'date-fns';

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  downvotes: number;
  image_url?: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url: string;
  } | null;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url: string;
  } | null;
  user_upvoted?: boolean;
  solution_upvotes: { user_id: string }[];
  solution_collaborators: {
    user_id: string;
    status: string;
    profiles: {
      full_name: string;
      username: string;
      avatar_url: string;
    } | null;
  }[];
  user_collaboration_status?: 'pending' | 'accepted' | 'rejected' | null;
  total_funding?: number;
  solution_funding: Funding[];
}

interface Funding {
  id: string;
  amount: number;
  currency: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url: string;
  } | null;
}

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { problems: allProblems, handleUpvote: contextHandleUpvote, handleDownvote: contextHandleDownvote } = useProblems();
  const { toast } = useToast();
  const { createNotification } = useNotify();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newSolution, setNewSolution] = useState({ title: '', description: '' });
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [solutionUpvotes, setSolutionUpvotes] = useState<Record<string, boolean>>({});
  const [chattingSolutionId, setChattingSolutionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProblemData();
    }
  }, [id, user]);

  const fetchProblemData = async () => {
    if (!id) return;
    try {
      // Fetch problem details
      const { data: problemData, error: problemError } = await supabase
        .from('problems')
        .select(`
          *,
          profiles (full_name, username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (problemError) throw problemError;
      setProblem(problemData as unknown as Problem);

      // Check if user has upvoted
      if (user) {
        const { data: upvoteData, error: upvoteError } = await supabase
          .from('problem_upvotes')
          .select('problem_id')
          .eq('problem_id', id)
          .eq('user_id', user.id);
        
        setHasUpvoted(!!upvoteData && upvoteData.length > 0);

        const { data: downvoteData, error: downvoteError } = await supabase
          .from('problem_downvotes')
          .select('problem_id')
          .eq('problem_id', id)
          .eq('user_id', user.id);
        
        setHasDownvoted(!!downvoteData && downvoteData.length > 0);
      }

      // Fetch solutions
      const { data: solutionsData, error: solutionsError } = await supabase
        .from('solutions')
        .select(`
          *,
          profiles (full_name, username, avatar_url),
          solution_upvotes (user_id),
          solution_collaborators (
            user_id,
            status,
            profiles (full_name, username, avatar_url)
          ),
          solution_funding (amount, currency, profiles (full_name, avatar_url))
        `)
        .eq('problem_id', id)
        .order('upvotes', { ascending: false });

      if (solutionsError) throw solutionsError;
      
      const processedSolutions = solutionsData?.map(solution => {
        const { profiles, solution_collaborators, ...rest } = solution;
        const collaboration = solution_collaborators.find(c => c.user_id === user?.id);
        return {
          ...rest,
          profiles: Array.isArray(profiles) ? profiles[0] : profiles,
          solution_collaborators,
          user_upvoted: user ? solution.solution_upvotes.some((upvote) => upvote.user_id === user.id) : false,
          user_collaboration_status: collaboration ? (collaboration.status as 'pending' | 'accepted' | 'rejected') : null,
          total_funding: solution.solution_funding.reduce((acc, f) => acc + f.amount, 0),
        };
      });
      
      setSolutions((processedSolutions as unknown as Solution[]) || []);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (full_name, username, avatar_url)
        `)
        .eq('problem_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData as unknown as Comment[] || []);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load problem details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProblemData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, user]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: newComment,
          problem_id: id,
          user_id: user.id
        })
        .select(`
          *,
          profiles (full_name, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data as unknown as Comment]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
      
      if (problem && user && problem.user_id !== user.id) {
        createNotification(
          problem.user_id,
          'new_comment',
          { problem_title: problem.title, comment_content: newComment },
          user.id,
          `/problem/${id}`
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleAddSolution = async () => {
    if (!user || !newSolution.title.trim() || !newSolution.description.trim()) return;

    try {
      const { data, error } = await supabase
        .from('solutions')
        .insert({
          title: newSolution.title,
          description: newSolution.description,
          problem_id: id,
          user_id: user.id
        })
        .select(`
          *,
          profiles (full_name, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      const newSolutionWithDefaults = {
        ...data,
        solution_upvotes: [],
        user_upvoted: false,
      };

      setSolutions(prev => [newSolutionWithDefaults as unknown as Solution, ...prev]);
      setNewSolution({ title: '', description: '' });
      setShowSolutionForm(false);
      
      toast({
        title: "Solution proposed",
        description: "Your solution has been added successfully",
      });

      if (problem && user && problem.user_id !== user.id) {
        createNotification(
          problem.user_id,
          'new_solution',
          { problem_title: problem.title, solution_title: newSolution.title },
          user.id,
          `/problem/${id}`
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add solution",
        variant: "destructive",
      });
    }
  };
  
  const handleSolutionUpvote = async (solutionId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote solutions",
        variant: "destructive",
      });
      return;
    }
    
    const solution = solutions.find(s => s.id === solutionId);
    if (!solution) return;

    try {
      if (solution.user_upvoted) {
        // Remove upvote
        await supabase
          .from('solution_upvotes')
          .delete()
          .eq('solution_id', solutionId)
          .eq('user_id', user.id);
      } else {
        // Add upvote
        await supabase
          .from('solution_upvotes')
          .insert({ solution_id: solutionId, user_id: user.id });
      }

      // Update local state
      setSolutions(prev => prev.map(s =>
        s.id === solutionId
          ? {
              ...s,
              user_upvoted: !s.user_upvoted,
              upvotes: s.user_upvoted ? s.upvotes - 1 : s.upvotes + 1
            }
          : s
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update upvote",
        variant: "destructive",
      });
    }
  };

  const handleCollaborationRequest = async (solutionId: string) => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to collaborate", variant: "destructive" });
      return;
    }

    const solution = solutions.find(s => s.id === solutionId);
    if (!solution) return;

    if (solution.user_id === user.id) {
      toast({ title: "This is your solution", description: "You cannot collaborate on your own solution.", variant: "destructive" });
      return;
    }

    try {
      // More robust check to prevent duplicate requests
      const existingRequest = solution.solution_collaborators.find(c => c.user_id === user.id);
      if (solution.user_collaboration_status || existingRequest) {
        toast({ title: "Request already sent", description: "You have already sent a collaboration request for this solution." });
        return;
      }

      // Optimistically update UI
      setSolutions(prev => prev.map(s =>
        s.id === solutionId
          ? { ...s, user_collaboration_status: 'pending' }
          : s
      ));

      const { error } = await supabase.from('solution_collaborators').insert({ solution_id: solutionId, user_id: user.id });
      
      if (error) {
        // Revert UI on error
        setSolutions(prev => prev.map(s =>
          s.id === solutionId
            ? { ...s, user_collaboration_status: null }
            : s
        ));
        throw error; // Re-throw to be caught by the outer catch block
      }
      
      toast({ title: "Request Sent", description: "Your collaboration request has been sent to the solution owner." });

      if (user && solution.user_id) {
        const notificationError = await createNotification(
          solution.user_id,
          'collaboration_request',
          { solution_title: solution.title, problem_id: id },
          user.id,
          `/dashboard`
        );

        if (notificationError) {
          toast({
            title: "Request Sent (Notification Failed)",
            description: "Your collaboration request was sent, but we failed to notify the solution owner.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send collaboration request.", variant: "destructive" });
    }
  };

  const handleFunding = async (solutionId: string, amount: number) => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to fund a solution", variant: "destructive" });
      return;
    }
    if (amount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a positive amount.", variant: "destructive" });
      return;
    }

    try {
      await supabase.from('solution_funding').insert({ solution_id: solutionId, user_id: user.id, amount, currency: 'USD' });
      
      setSolutions(prev => prev.map(s =>
        s.id === solutionId
          ? { ...s, total_funding: (s.total_funding || 0) + amount }
          : s
      ));
      
      toast({ title: "Funding Successful", description: `Thank you for your contribution of $${amount}!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process funding.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
        <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
        <Link to="/">
          <Button>Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    finance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    health: "bg-green-500/10 text-green-400 border-green-500/20",
    productivity: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    technology: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    lifestyle: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    other: "bg-muted text-muted-foreground border-border",
  };

  const uniqueCollaborators = new Map();
  solutions
    .flatMap(s => s.solution_collaborators || [])
    .filter(c => c.status === 'accepted')
    .forEach(collaborator => {
      if (!uniqueCollaborators.has(collaborator.user_id)) {
        uniqueCollaborators.set(collaborator.user_id, collaborator);
      }
    });
  const acceptedCollaborators = Array.from(uniqueCollaborators.values());

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
      <div className="md:col-span-2">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} />
          Back to Feed
        </Link>
    {/* Problem Header */}
    <Card className="mb-8 shadow-card">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={() => id && contextHandleUpvote(id)}
              variant="ghost"
              size="sm"
              className={`h-auto p-3 flex flex-col items-center transition-colors ${
                hasUpvoted
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ChevronUp size={24} />
              <span className="text-lg font-semibold">{problem.upvotes}</span>
            </Button>
            <Button
             onClick={() => id && contextHandleDownvote(id)}
             variant="ghost"
             size="sm"
             className={`h-auto p-3 flex flex-col items-center transition-colors ${
               hasDownvoted
                 ? "text-destructive bg-destructive/10"
                 : "text-muted-foreground hover:text-destructive"
             }`}
           >
             <ChevronDown size={24} />
             <span className="text-lg font-semibold">{problem.downvotes}</span>
           </Button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {problem.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <Badge
                variant="outline"
                className={categoryColors[problem.category] || categoryColors.other}
              >
                {problem.category}
              </Badge>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={problem.profiles?.avatar_url} />
                  <AvatarFallback>
                    {problem.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{problem.profiles?.full_name || 'Anonymous'}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>
            {problem.image_url && (
              <div className="mt-4">
                <img src={problem.image_url} alt={problem.title} className="w-full h-auto rounded-lg" />
              </div>
            )}
            {user && user.id === problem.user_id && (
              <div className="mt-4">
                <Link to={`/problem/${problem.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit size={14} className="mr-2" />
                    Edit Problem
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>

    {/* Tabs for Solutions, Comments, Collaboration, Funding */}
    <Tabs defaultValue="comments" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="comments" className="flex items-center gap-2">
          <MessageCircle size={16} />
          Comments ({comments.length})
        </TabsTrigger>
        <TabsTrigger value="solutions" className="flex items-center gap-2">
          <Lightbulb size={16} />
          Solutions ({solutions.length})
        </TabsTrigger>
        <TabsTrigger value="collaboration" className="flex items-center gap-2">
          <Users size={16} />
          Collaborate
        </TabsTrigger>
        <TabsTrigger value="funding" className="flex items-center gap-2">
          <DollarSign size={16} />
          Fund This
        </TabsTrigger>
      </TabsList>

      {/* Comments Tab */}
      <TabsContent value="comments" className="space-y-6">
        {user && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts on this problem..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send size={16} className="mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profiles?.avatar_url} />
                    <AvatarFallback>
                      {comment.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {comment.profiles?.full_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Solutions Tab */}
      <TabsContent value="solutions" className="space-y-6">
        {user && (
          <div className="space-y-4">
            {!showSolutionForm ? (
              <Button onClick={() => setShowSolutionForm(true)} className="w-full">
                <Lightbulb size={16} className="mr-2" />
                Propose a Solution
              </Button>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Solution Title</label>
                      <Input
                        placeholder="Give your solution a catchy title..."
                        value={newSolution.title}
                        onChange={(e) => setNewSolution(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Solution Description</label>
                      <Textarea
                        placeholder="Describe your solution in detail..."
                        value={newSolution.description}
                        onChange={(e) => setNewSolution(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-32"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddSolution}
                        disabled={!newSolution.title.trim() || !newSolution.description.trim()}
                      >
                        <Send size={16} className="mr-2" />
                        Propose Solution
                      </Button>
                      <Button variant="outline" onClick={() => setShowSolutionForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="space-y-4">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              onUpvote={handleSolutionUpvote}
              onCollaborate={handleCollaborationRequest}
              onFund={handleFunding}
              onOpenChat={setChattingSolutionId}
            />
          ))}
          
          {solutions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
              <p>No solutions proposed yet. Be the first to suggest one!</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Collaboration Tab */}
      <TabsContent value="collaboration" className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Join the Team</h3>
            <p className="text-muted-foreground">
              Looking to collaborate on solving this problem? Connect with like-minded individuals.
            </p>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Current Team Members</h4>
              <div className="space-y-3">
                {acceptedCollaborators.map(collaborator => (
                  <div key={collaborator.user_id} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaborator.profiles?.avatar_url} />
                      <AvatarFallback>{collaborator.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{collaborator.profiles?.full_name}</p>
                      <p className="text-xs text-muted-foreground">@{collaborator.profiles?.username}</p>
                    </div>
                  </div>
                ))}
                {acceptedCollaborators.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No team members yet. Be the first to join!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Funding Tab */}
      <TabsContent value="funding" className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Support This Problem</h3>
            <p className="text-muted-foreground">
              Help fund the development of solutions to this problem.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">${solutions.reduce((acc, s) => acc + (s.total_funding || 0), 0)}</div>
                <div className="text-sm text-muted-foreground">Raised</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{solutions.flatMap(s => s.solution_funding || []).length}</div>
                <div className="text-sm text-muted-foreground">Backers</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">∞</div>
                <div className="text-sm text-muted-foreground">Days Left</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Support Tiers</h4>
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Basic Support</h5>
                      <p className="text-sm text-muted-foreground">Show your interest in this problem</p>
                    </div>
                    <Button variant="outline">$10</Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Solution Backer</h5>
                      <p className="text-sm text-muted-foreground">Help fund solution development</p>
                    </div>
                    <Button variant="outline">$50</Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Problem Solver</h5>
                      <p className="text-sm text-muted-foreground">Major contribution to solution</p>
                    </div>
                    <Button>$200</Button>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Recent Supporters</h4>
              <div className="space-y-3">
                {solutions.flatMap(s => s.solution_funding || []).slice(0, 5).map((fund: Funding) => (
                  <div key={fund.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={fund.profiles?.avatar_url} />
                        <AvatarFallback>{fund.profiles?.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{fund.profiles?.full_name}</p>
                    </div>
                    <p className="text-sm font-semibold text-green-500">${fund.amount}</p>
                  </div>
                ))}
                {solutions.flatMap(s => s.solution_funding || []).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No supporters yet. Be the first to fund this problem!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>

  {/* Right Sidebar */}
  <aside className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Other Problems</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {allProblems
            .filter((p) => p.id !== id)
            .slice(0, 5)
            .map((p) => (
              <ProblemCardV2
                key={p.id}
                problem={p}
                onUpvote={contextHandleUpvote}
                onDownvote={contextHandleDownvote}
                hideVoting={true}
                layout="sidebar"
              />
            ))}
        </div>
      </CardContent>
    </Card>
  </aside>

    {chattingSolutionId && (
      <Dialog open={!!chattingSolutionId} onOpenChange={(isOpen) => !isOpen && setChattingSolutionId(null)}>
        <DialogContent className="max-w-3xl h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Team Chat</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <SolutionChat solutionId={chattingSolutionId} />
          </div>
        </DialogContent>
      </Dialog>
    )}
  </main>
  );
};

export default ProblemDetail;

interface SolutionCardProps {
  solution: Solution;
  onUpvote: (solutionId: string) => void;
  onCollaborate: (solutionId: string) => void;
  onFund: (solutionId: string, amount: number) => void;
  onOpenChat: (solutionId: string) => void;
}

const SolutionCard = ({ solution, onUpvote, onCollaborate, onFund, onOpenChat }: SolutionCardProps) => {
  const [fundAmount, setFundAmount] = useState(10);

  const handleFundClick = () => {
    onFund(solution.id, fundAmount);
  };
  
  const collaborationButtonText = () => {
    switch (solution.user_collaboration_status) {
      case 'pending': return 'Request Sent';
      case 'accepted': return 'View Team';
      default: return 'Collaborate';
    }
  };
  
  return (
    <Card className="bg-gradient-card">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <Button
              onClick={() => onUpvote(solution.id)}
              variant="ghost"
              size="sm"
              className={`h-auto p-2 flex flex-col items-center transition-colors ${
                solution.user_upvoted
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ChevronUp size={20} />
              <span className="text-sm font-medium">{solution.upvotes}</span>
            </Button>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
            <p className="text-foreground mb-4 whitespace-pre-wrap">{solution.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={solution.profiles?.avatar_url} />
                    <AvatarFallback>
                      {solution.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{solution.profiles?.full_name || 'Anonymous'}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(solution.created_at), { addSuffix: true })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {solution.status}
                </Badge>
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="text-sm font-semibold text-green-500">
                  ${solution.total_funding || 0}
                </div>
                <Button variant="outline" size="sm" onClick={handleFundClick}>
                  <Heart size={14} className="mr-1" />
                  Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (solution.user_collaboration_status === 'accepted') {
                      onOpenChat(solution.id);
                    } else {
                      onCollaborate(solution.id);
                    }
                  }}
                  disabled={solution.user_collaboration_status === 'pending'}
                >
                  <Users size={14} className="mr-1" />
                  {collaborationButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};