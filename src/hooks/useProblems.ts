import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Problem {
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
  user_upvoted?: boolean;
  comments_count?: number;
}

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          profiles!problems_user_id_fkey (full_name, username, avatar_url),
          problem_upvotes!left (user_id),
          comments!left (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedProblems = data?.map(problem => ({
        ...problem,
        user_upvoted: user ? problem.problem_upvotes.some((upvote: any) => upvote.user_id === user.id) : false,
        comments_count: problem.comments?.length || 0
      })) as Problem[];

      setProblems(processedProblems || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpvote = async (problemId: string) => {
    if (!user) return;

    try {
      const problem = problems.find(p => p.id === problemId);
      if (!problem) return;

      if (problem.user_upvoted) {
        // Remove upvote
        await supabase
          .from('problem_upvotes')
          .delete()
          .eq('problem_id', problemId)
          .eq('user_id', user.id);
      } else {
        // Add upvote
        await supabase
          .from('problem_upvotes')
          .insert({ problem_id: problemId, user_id: user.id });
      }

      // Update local state
      setProblems(prev => prev.map(p => 
        p.id === problemId 
          ? { 
              ...p, 
              user_upvoted: !p.user_upvoted,
              upvotes: p.user_upvoted ? p.upvotes - 1 : p.upvotes + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [user]);

  return { problems, loading, toggleUpvote, refetch: fetchProblems };
};