import Navigation from "@/components/Navigation";
import ProblemCard from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProblems } from "@/data/mockProblems";
import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", "finance", "health", "productivity", "technology", "lifestyle", "other"];

  const filteredAndSortedProblems = mockProblems
    .filter(problem => filterCategory === "all" || problem.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
      }
      return b.upvotes - a.upvotes;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Discover Problems
            </span>
            <br />
            <span className="text-foreground">Build Solutions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A crowdsourced platform where people share daily problems and entrepreneurs find opportunities to create solutions.
          </p>
          <Link to="/post">
            <Button className="bg-gradient-primary hover:shadow-primary transition-all duration-300">
              <Plus size={16} className="mr-2" />
              Post Your Problem
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border border-border shadow-card">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground sm:ml-auto">
            {filteredAndSortedProblems.length} problems found
          </div>
        </div>

        {/* Problems Feed */}
        <div className="space-y-6">
          {filteredAndSortedProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems found for the selected filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSortBy("newest");
              setFilterCategory("all");
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
