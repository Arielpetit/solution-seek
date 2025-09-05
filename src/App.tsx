import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProblemsProvider } from "./contexts/ProblemsContext";
import Index from "./pages/Index";
import Trending from "./pages/Trending";
import PostProblem from "./pages/PostProblem";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ProblemDetail from "./pages/ProblemDetail";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import EditProblem from "./pages/EditProblem";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import About from "./pages/About";
import ProblemHubRules from "./pages/ProblemHubRules";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UserAgreement from "./pages/UserAgreement";
import Accessibility from "./pages/Accessibility";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ProblemsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/*"
                  element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/trending" element={<Trending />} />
                        <Route path="/post" element={<PostProblem />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/problem/:id"
                          element={<ProblemDetail />}
                        />
                        <Route path="/problem/:id/edit" element={<EditProblem />} />
                        <Route path="/edit-problem/:id" element={<EditProblem />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/rules" element={<ProblemHubRules />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/agreement" element={<UserAgreement />} />
                        <Route path="/accessibility" element={<Accessibility />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </ProblemsProvider>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
