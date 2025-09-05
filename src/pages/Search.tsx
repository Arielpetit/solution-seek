import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProblemCardV2 from "@/components/ProblemCardV2";
import { supabase } from "@/integrations/supabase/client";
import { Problem, useProblems } from "@/contexts/ProblemsContext";
import { Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleUpvote, handleDownvote } = useProblems();

  const query = searchParams.get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("problems")
          .select("*, profiles (full_name, username, avatar_url)")
          .textSearch("title", query);

        if (error) throw error;
        setSearchResults(data as Problem[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch search results.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SearchIcon size={28} />
            Search Results for: <span className="text-primary">"{query}"</span>
          </h1>
        </div>

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
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((problem) => (
              <ProblemCardV2
                key={problem.id}
                problem={problem}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No problems found for your search. Try a different query.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;