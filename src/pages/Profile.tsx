import Navigation from "@/components/Navigation";
import ProblemCard from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProblems } from "@/data/mockProblems";
import { User, Calendar, TrendingUp, MessageCircle, Settings } from "lucide-react";

const Profile = () => {
  // Mock user data - in real app this would come from authentication
  const user = {
    name: "Alex Johnson",
    username: "alex_johnson",
    email: "alex@example.com",
    joinedDate: "March 2024",
    bio: "Product manager passionate about solving everyday problems through technology."
  };

  // Filter problems by mock user
  const userProblems = mockProblems.filter(p => p.author === "mike_dev" || p.author === "remote_worker");
  const userComments = mockProblems.filter(p => p.comments > 15); // Mock commented problems

  const stats = {
    problemsPosted: userProblems.length,
    totalUpvotes: userProblems.reduce((sum, p) => sum + p.upvotes, 0),
    commentsGiven: 47 // Mock data
  };

  return (
    <div className="min-h-screen bg-background">
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
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Calendar size={14} />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
            {user.bio && (
              <p className="text-muted-foreground mt-4">{user.bio}</p>
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

        {/* Activity Tabs */}
        <Tabs defaultValue="problems" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="problems" className="flex items-center gap-2">
              <TrendingUp size={16} />
              My Problems ({userProblems.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Commented On ({userComments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-6">
            {userProblems.length > 0 ? (
              userProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
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
                  <Button className="bg-gradient-primary hover:shadow-primary transition-all duration-300">
                    Post Your First Problem
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            {userComments.length > 0 ? (
              userComments.map((problem) => (
                <div key={problem.id} className="relative">
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground"
                  >
                    Commented
                  </Badge>
                  <ProblemCard problem={problem} />
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
                  <Button variant="outline">
                    Browse Problems
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;