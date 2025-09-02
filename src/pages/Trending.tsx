import Navigation from "@/components/Navigation";
import ProblemCard from "@/components/ProblemCard";
import { mockProblems } from "@/data/mockProblems";
import { TrendingUp, Trophy, Award } from "lucide-react";

const Trending = () => {
  // Sort problems by upvotes (descending)
  const trendingProblems = [...mockProblems].sort((a, b) => b.upvotes - a.upvotes);

  const getTrendingIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500" size={20} />;
    if (index === 1) return <Award className="text-gray-400" size={20} />;
    if (index === 2) return <Award className="text-orange-600" size={20} />;
    return <span className="text-muted-foreground text-sm font-bold">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="text-primary" size={32} />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Trending Problems
              </span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The most upvoted problems right now. These represent the biggest pain points people are facing.
          </p>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-card text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {trendingProblems.reduce((sum, p) => sum + p.upvotes, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Upvotes</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-card text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {trendingProblems.length}
            </div>
            <div className="text-sm text-muted-foreground">Problems Posted</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-card text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {trendingProblems.reduce((sum, p) => sum + p.comments, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Comments</div>
          </div>
        </div>

        {/* Trending Problems */}
        <div className="space-y-6">
          {trendingProblems.map((problem, index) => (
            <div key={problem.id} className="relative">
              <div className="absolute -left-4 top-4 z-10 bg-card rounded-full p-2 border border-border shadow-sm">
                {getTrendingIcon(index)}
              </div>
              <div className="ml-8">
                <ProblemCard problem={problem} />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-card p-8 rounded-xl border border-border">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            See a problem worth solving?
          </h3>
          <p className="text-muted-foreground mb-4">
            Join the discussion and help validate solutions, or start building!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Trending;