import ProblemCardV2 from "@/components/ProblemCardV2";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProblems } from "@/contexts/ProblemsContext";
import { useState } from "react";
import { Filter, Plus, Rss, Tags, Briefcase, Heart, Brain, Cpu, Dumbbell, GraduationCap, Car, HelpCircle, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const { problems, loading, handleUpvote, handleDownvote } = useProblems();
  const { user } = useAuth();

  const categories = [
      { name: "all", icon: Globe },
      { name: "finance", icon: Briefcase },
      { name: "health", icon: Heart },
      { name: "productivity", icon: Brain },
      { name: "technology", icon: Cpu },
      { name: "lifestyle", icon: Dumbbell },
      { name: "education", icon: GraduationCap },
      { name: "transport", icon: Car },
      { name: "other", icon: HelpCircle },
    ];
  
  const filteredAndSortedProblems = problems
      .filter(problem => {
        if (filterCategory !== "all" && problem.category !== filterCategory) {
          return false;
        }
        if (filterTime === "all") {
          return true;
        }
        const problemDate = new Date(problem.created_at);
        const now = new Date();
        if (filterTime === "day") {
          return now.getTime() - problemDate.getTime() < 24 * 60 * 60 * 1000;
        }
        if (filterTime === "week") {
          return now.getTime() - problemDate.getTime() < 7 * 24 * 60 * 60 * 1000;
        }
        if (filterTime === "year") {
          return now.getFullYear() - problemDate.getFullYear() < 1;
        }
        return true;
      })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.upvotes - a.upvotes;
    });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && setSortBy(value)} className="bg-card p-1 rounded-lg">
            <ToggleGroupItem value="newest" aria-label="Sort by newest">
              Newest
            </ToggleGroupItem>
            <ToggleGroupItem value="popular" aria-label="Sort by popular">
              Popular
            </ToggleGroupItem>
          </ToggleGroup>
            <Select value={filterTime} onValueChange={setFilterTime}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedProblems.length} problems found
          </div>
        </div>

        {/* Problems Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-card rounded-lg p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            filteredAndSortedProblems.map((problem) => (
              <ProblemCardV2
                key={problem.id}
                problem={problem}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredAndSortedProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems found for the selected filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => setFilterCategory("all")}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rss size={18} />
              <span>Contribute</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Have a problem you're passionate about? Share it with the community and let's build a solution together.
            </p>
            <Link to={user ? "/post" : "/auth"}>
              <Button className="w-full">
                <Plus size={16} className="mr-2" />
                {user ? "Post Your Problem" : "Sign In to Post"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags size={18} />
              <span>Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setFilterCategory(category.name)}
                  className={`flex items-center space-x-2 text-left p-2 rounded-md transition-colors text-sm w-full ${
                    filterCategory === category.name
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-muted'
                  }`}
                >
                  <category.icon size={16} />
                  <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </main>
  );
};

export default Index;
