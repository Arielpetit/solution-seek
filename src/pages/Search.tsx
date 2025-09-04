import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProblemCardV2 from '@/components/ProblemCardV2';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Problem } from '@/hooks/useProblems';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    'all', 'finance', 'health', 'productivity', 'technology', 'lifestyle', 
    'education', 'transport', 'other'
  ];

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, []);

  const performSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from('problems')
        .select(`
          *,
          profiles!problems_user_id_fkey (full_name, username, avatar_url),
          problem_upvotes!left (user_id),
          comments!left (id)
        `);

      // Add text search
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      // Add category filter
      if (filterCategory !== 'all') {
        supabaseQuery = supabaseQuery.eq('category', filterCategory);
      }

      // Add sorting
      if (sortBy === 'popular') {
        supabaseQuery = supabaseQuery.order('upvotes', { ascending: false });
      } else {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      const processedProblems = data?.map(problem => ({
        ...problem,
        user_upvoted: false, // TODO: Check user upvotes
        comments_count: problem.comments?.length || 0
      })) as Problem[];

      setProblems(processedProblems || []);
    } catch (error) {
      console.error('Error searching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setProblems([]);
  };

  const handleUpvote = (problemId: string) => {
    // TODO: Implement upvote functionality
    console.log('Upvote problem:', problemId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Problems</h1>
          
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search for problems, solutions, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X size={14} />
                </Button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="sm:w-auto">
                <SearchIcon size={16} className="mr-2" />
                Search
              </Button>
              
              <div className="flex gap-2 flex-1">
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
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {searchQuery && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {loading ? 'Searching...' : `${problems.length} results for "${searchQuery}"`}
              </p>
              {problems.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter size={14} />
                  <span>Filtered by {filterCategory !== 'all' ? filterCategory : 'all categories'}</span>
                </div>
              )}
            </div>
          )}

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
          ) : problems.length > 0 ? (
            <div className="space-y-6">
              {problems.map((problem) => (
                <ProblemCardV2 key={problem.id} problem={problem} onUpvote={handleUpvote} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <SearchIcon size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any problems matching "{searchQuery}"
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Search for Problems</h3>
              <p className="text-muted-foreground">
                Enter keywords to find problems, solutions, or topics that interest you
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;