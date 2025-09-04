-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create problems table
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create upvotes table to track user upvotes
CREATE TABLE public.problem_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(problem_id, user_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create solutions table
CREATE TABLE public.solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'proposed',
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create solution upvotes table
CREATE TABLE public.solution_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(solution_id, user_id)
);

-- Create collaboration requests table
CREATE TABLE public.collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaborator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create funding interests table
CREATE TABLE public.funding_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_range TEXT,
  message TEXT,
  status TEXT DEFAULT 'interested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_interests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Problems policies
CREATE POLICY "Problems are viewable by everyone" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert problems" ON public.problems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.problems FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own problems" ON public.problems FOR DELETE USING (auth.uid() = user_id);

-- Problem upvotes policies
CREATE POLICY "Upvotes are viewable by everyone" ON public.problem_upvotes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own upvotes" ON public.problem_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own upvotes" ON public.problem_upvotes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Solutions policies
CREATE POLICY "Solutions are viewable by everyone" ON public.solutions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert solutions" ON public.solutions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own solutions" ON public.solutions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own solutions" ON public.solutions FOR DELETE USING (auth.uid() = user_id);

-- Solution upvotes policies
CREATE POLICY "Solution upvotes are viewable by everyone" ON public.solution_upvotes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own solution upvotes" ON public.solution_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own solution upvotes" ON public.solution_upvotes FOR DELETE USING (auth.uid() = user_id);

-- Collaborations policies
CREATE POLICY "Users can view their own collaborations" ON public.collaborations FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = collaborator_id);
CREATE POLICY "Authenticated users can create collaboration requests" ON public.collaborations FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update collaborations they're part of" ON public.collaborations FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = collaborator_id);

-- Funding interests policies
CREATE POLICY "Problem owners and investors can view funding interests" ON public.funding_interests FOR SELECT USING (
  auth.uid() = investor_id OR 
  EXISTS (SELECT 1 FROM public.problems WHERE problems.id = funding_interests.problem_id AND problems.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can express funding interest" ON public.funding_interests FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "Investors can update their own funding interests" ON public.funding_interests FOR UPDATE USING (auth.uid() = investor_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update upvote counts
CREATE OR REPLACE FUNCTION public.update_problem_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.problems SET upvotes = upvotes + 1 WHERE id = NEW.problem_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.problems SET upvotes = upvotes - 1 WHERE id = OLD.problem_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update problem upvote counts
CREATE TRIGGER update_problem_upvotes_trigger
  AFTER INSERT OR DELETE ON public.problem_upvotes
  FOR EACH ROW EXECUTE PROCEDURE public.update_problem_upvotes();

-- Create function to update solution upvote counts
CREATE OR REPLACE FUNCTION public.update_solution_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.solutions SET upvotes = upvotes + 1 WHERE id = NEW.solution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.solutions SET upvotes = upvotes - 1 WHERE id = OLD.solution_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update solution upvote counts
CREATE TRIGGER update_solution_upvotes_trigger
  AFTER INSERT OR DELETE ON public.solution_upvotes
  FOR EACH ROW EXECUTE PROCEDURE public.update_solution_upvotes();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON public.solutions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();