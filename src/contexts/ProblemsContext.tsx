import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
  user_upvoted?: boolean;
  user_downvoted?: boolean;
  comments_count?: number;
}

interface ProblemsContextType {
  problems: Problem[];
  loading: boolean;
  refetch: () => void;
  handleUpvote: (problemId: string) => void;
  handleDownvote: (problemId: string) => void;
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

export const useProblems = () => {
  const context = useContext(ProblemsContext);
  if (!context) {
    throw new Error('useProblems must be used within a ProblemsProvider');
  }
  return context;
};

export const ProblemsProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          profiles!inner (full_name, username, avatar_url),
          problem_upvotes!left (user_id),
          problem_downvotes!left (user_id),
          comments!left (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedProblems = data?.map(problem => {
        const { problem_upvotes, problem_downvotes, comments, ...rest } = problem;
        return {
          ...rest,
          profiles: Array.isArray(problem.profiles) ? problem.profiles[0] : problem.profiles,
          user_upvoted: user ? problem_upvotes.some(upvote => upvote.user_id === user.id) : false,
          user_downvoted: user ? problem_downvotes.some(downvote => downvote.user_id === user.id) : false,
          comments_count: comments?.length || 0,
          upvotes: problem_upvotes?.length || 0,
          downvotes: problem_downvotes?.length || 0,
        } as unknown as Problem;
      }) || [];

      setProblems(processedProblems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleUpvote = async (problemId: string) => {
    if (!user) return;
    const { error } = await supabase.rpc('handle_problem_upvote', { problem_id_arg: problemId, user_id_arg: user.id });
    if (error) console.error('Error upvoting:', error);
    else fetchProblems();
  };

  const handleDownvote = async (problemId: string) => {
    if (!user) return;
    const { error } = await supabase.rpc('handle_problem_downvote', { problem_id_arg: problemId, user_id_arg: user.id });
    if (error) console.error('Error downvoting:', error);
    else fetchProblems();
  };

  return (
    <ProblemsContext.Provider value={{ problems, loading, refetch: fetchProblems, handleUpvote, handleDownvote }}>
      {children}
    </ProblemsContext.Provider>
  );
};