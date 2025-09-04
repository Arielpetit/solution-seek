import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronUp, 
  MessageCircle, 
  User, 
  Clock, 
  ArrowLeft, 
  Users, 
  DollarSign,
  Send,
  Lightbulb,
  Heart,
  Flag
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

interface Solution {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newSolution, setNewSolution] = useState({ title: '', description: '' });
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProblemData();
    }
  }, [id, user]);

  const fetchProblemData = async () => {
    try {
      // Fetch problem details
      const { data: problemData, error: problemError } = await supabase
        .from('problems')
        .select(`
          *,
          profiles!problems_user_id_fkey (full_name, username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (problemError) throw problemError;
      setProblem(problemData as Problem);

      // Check if user has upvoted
      if (user) {
        const { data: upvoteData } = await supabase
          .from('problem_upvotes')
          .select('id')
          .eq('problem_id', id)
          .eq('user_id', user.id)
          .single();
        
        setHasUpvoted(!!upvoteData);
      }

      // Fetch solutions
      const { data: solutionsData, error: solutionsError } = await supabase
        .from('solutions')
        .select(`
          *,
          profiles!solutions_user_id_fkey (full_name, username, avatar_url)
        `)
        .eq('problem_id', id)
        .order('upvotes', { ascending: false });

      if (solutionsError) throw solutionsError;
      setSolutions(solutionsData as Solution[] || []);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_user_id_fkey (full_name, username, avatar_url)
        `)
        .eq('problem_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData as Comment[] || []);

    } catch (error) {
      console.error('Error fetching problem data:', error);
      toast({
        title: "Error",
        description: "Failed to load problem details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote problems",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasUpvoted) {
        // Remove upvote
        await supabase
          .from('problem_upvotes')
          .delete()
          .eq('problem_id', id)
          .eq('user_id', user.id);
        
        setHasUpvoted(false);
        setProblem(prev => prev ? { ...prev, upvotes: prev.upvotes - 1 } : null);
      } else {
        // Add upvote
        await supabase
          .from('problem_upvotes')
          .insert({ problem_id: id, user_id: user.id });
        
        setHasUpvoted(true);
        setProblem(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
      }
    } catch (error) {
      console.error('Error handling upvote:', error);
      toast({
        title: "Error",
        description: "Failed to update upvote",
        variant: "destructive",
      });
    }
  };

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
          profiles!comments_user_id_fkey (full_name, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data as Comment]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
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
          profiles!solutions_user_id_fkey (full_name, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setSolutions(prev => [data as Solution, ...prev]);
      setNewSolution({ title: '', description: '' });
      setShowSolutionForm(false);
      
      toast({
        title: "Solution proposed",
        description: "Your solution has been added successfully",
      });
    } catch (error) {
      console.error('Error adding solution:', error);
      toast({
        title: "Error",
        description: "Failed to add solution",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
          <Link to="/">
            <Button>Back to Feed</Button>
          </Link>
        </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
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
                  onClick={handleUpvote}
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
                <Card key={solution.id} className="bg-gradient-card">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-auto p-2 flex flex-col items-center">
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
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart size={14} className="mr-1" />
                              Support
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users size={14} className="mr-1" />
                              Collaborate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <span className="text-xs">👨‍💻</span>
                    </div>
                    <span className="text-sm">Developer</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <span className="text-xs">🎨</span>
                    </div>
                    <span className="text-sm">Designer</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <span className="text-xs">📈</span>
                    </div>
                    <span className="text-sm">Marketer</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <span className="text-xs">💼</span>
                    </div>
                    <span className="text-sm">Business</span>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Current Team Members</h4>
                  <div className="text-center py-4 text-muted-foreground">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No team members yet. Be the first to join!</p>
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
                    <div className="text-2xl font-bold text-green-500">$0</div>
                    <div className="text-sm text-muted-foreground">Raised</div>
                  </div>
                  <div className="text-center p-4 bg-card/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">0</div>
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
                  <h4 className="font-medium mb-3">Interested Investors</h4>
                  <div className="text-center py-4 text-muted-foreground">
                    <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No investors yet. Be the first to support this problem!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProblemDetail;