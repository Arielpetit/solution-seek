import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, TrendingUp, MessageCircle, Settings, Mail, Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ProblemCardV2 from "@/components/ProblemCardV2";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import EditProfileModal from "@/components/EditProfileModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

type ProfileWithProblems = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
};

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles: ProfileWithProblems;
  problem_upvotes: { user_id: string }[];
  problem_downvotes: { user_id: string }[];
  solutions: { id: string }[];
  comments: number;
};

const Profile = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileWithProblems | null>(null);
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [commentedProblems, setCommentedProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState({
    problemsPosted: 0,
    totalUpvotes: 0,
    commentsGiven: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileError) throw profileError;
      setProfile(profileData as ProfileWithProblems);

      // Fetch user's problems
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('*, profiles!inner(*), problem_upvotes(*), problem_downvotes(*), solutions(*), comments(*)')
        .eq('user_id', session.user.id);
      if (problemsError) throw problemsError;
      setUserProblems(problemsData as unknown as Problem[]);

      // Fetch commented problems
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('problem_id')
        .eq('user_id', session.user.id);

      if (commentsError) throw commentsError;
      
      const problemIds = [...new Set(commentsData.map(c => c.problem_id))];

      if (problemIds.length > 0) {
        const { data: commentedProblemsData, error: commentedProblemsError } = await supabase
          .from('problems')
          .select('*, profiles!inner(*), problem_upvotes(*), problem_downvotes(*), solutions(*), comments(*)')
          .in('id', problemIds);
        
        if (commentedProblemsError) throw commentedProblemsError;
        setCommentedProblems(commentedProblemsData as unknown as Problem[]);
      }
      
      // Calculate stats
      const totalUpvotes = problemsData.reduce((sum, p) => sum + p.problem_upvotes.length, 0);
      setStats({
        problemsPosted: problemsData.length,
        totalUpvotes: totalUpvotes,
        commentsGiven: commentsData.length,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpvote = async (problemId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to upvote.",
        variant: "destructive"
      });
      return;
    }

    const userId = session.user.id;
    
    const { error } = await supabase.rpc('handle_problem_upvote', { problem_id_arg: problemId, user_id_arg: userId });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to upvote.",
        variant: "destructive"
      });
    } else {
      fetchData();
    }
  };

  const handleDownvote = async (problemId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to downvote.",
        variant: "destructive"
      });
      return;
    }
    const userId = session.user.id;

    const { error } = await supabase.rpc('handle_problem_downvote', { problem_id_arg: problemId, user_id_arg: userId });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to downvote.",
        variant: "destructive"
      });
    } else {
      fetchData();
    }
  };

  const handleDeleteProblem = (problemId: string) => {
    setProblemToDelete(problemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!problemToDelete) return;

    const { error } = await supabase.from("problems").delete().eq("id", problemToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete problem.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Problem deleted successfully.",
      });
      fetchData();
    }

    setIsDeleteModalOpen(false);
    setProblemToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="bg-gradient-card shadow-card border-border/50 mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="text-white" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || 'Loading...'}</h1>
                    <p className="text-muted-foreground">@{profile?.username}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Joined {profile?.created_at ? format(new Date(profile.created_at), "MMMM yyyy") : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{session?.user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Last seen {session?.user.last_sign_in_at ? format(new Date(session.user.last_sign_in_at), "PPpp") : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {profile?.bio && (
                <p className="text-muted-foreground mt-4">{profile.bio}</p>
              )}
            </CardHeader>
          </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card shadow-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.problemsPosted}
              </div>
              <div className="text-sm text-muted-foreground">Problems Posted</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.totalUpvotes}
              </div>
              <div className="text-sm text-muted-foreground">Total Upvotes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.commentsGiven}
              </div>
              <div className="text-sm text-muted-foreground">Comments Given</div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card className="bg-card shadow-card border-border/50 mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Account Details</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Full Name</span>
                <span>{profile?.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Username</span>
                <span>@{profile?.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span>{session?.user.email}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Signed In</span>
                <span>{session?.user.last_sign_in_at ? format(new Date(session.user.last_sign_in_at), "PPpp"):'N/A'}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
               <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                 <Settings size={16} className="mr-2" />
                 Edit Profile
               </Button>
               <Button variant="destructive" onClick={() => setIsChangePasswordModalOpen(true)}>Change Password</Button>
             </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="problems" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="problems" className="flex items-center gap-2">
              <TrendingUp size={16} />
              My Problems ({userProblems.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Commented On ({commentedProblems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-6">
            {loading ? <p>Loading problems...</p> : (
              userProblems.length > 0 ? (
                userProblems.map((problem) => (
                  <ProblemCardV2
                    key={problem.id}
                    problem={problem}
                    onUpvote={() => handleUpvote(problem.id)}
                    onDownvote={() => handleDownvote(problem.id)}
                    showActions={true}
                    onDelete={handleDeleteProblem}
                  />
                ))
              ) : (
                <Card className="bg-card shadow-card border-border/50">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No problems posted yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Share your first problem with the community
                    </p>
                    <Button asChild className="bg-gradient-primary hover:shadow-primary transition-all duration-300">
                      <Link to="/post-problem">Post Your First Problem</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            {loading ? <p>Loading comments...</p> : (
              commentedProblems.length > 0 ? (
                commentedProblems.map((problem) => (
                  <div key={problem.id} className="relative">
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground"
                    >
                      Commented
                    </Badge>
                    <ProblemCardV2 
                      problem={problem}
                      onUpvote={() => handleUpvote(problem.id)}
                      onDownvote={() => handleDownvote(problem.id)}
                    />
                  </div>
                ))
              ) : (
                <Card className="bg-card shadow-card border-border/50">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No comments yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start engaging with the community by commenting on problems
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/">Browse Problems</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>
        </Tabs>
        </main>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        session={session}
        profile={profile}
        onProfileUpdate={fetchData}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Profile;