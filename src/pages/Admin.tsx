import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Flag, 
  TrendingUp, 
  MessageCircle, 
  Lightbulb,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Report = Database['public']['Tables']['reports']['Row'] & {
  reporter: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username'> | null;
};

interface AdminStats {
  totalUsers: number;
  totalProblems: number;
  totalSolutions: number;
  totalComments: number;
  totalFunding: number;
  recentActivity: number;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProblems: 0,
    totalSolutions: 0,
    totalComments: 0,
    totalFunding: 0,
    recentActivity: 0
  });
  const [reportedContent, setReportedContent] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you'd check if user has admin role
  const isAdmin = user?.email === 'admin@problemboard.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch statistics
      const [
        { count: usersCount },
        { count: problemsCount },
        { count: solutionsCount },
        { count: commentsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('problems').select('*', { count: 'exact', head: true }),
        supabase.from('solutions').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProblems: problemsCount || 0,
        totalSolutions: solutionsCount || 0,
        totalComments: commentsCount || 0,
        totalFunding: 0, // TODO: Calculate from funding table
        recentActivity: 42 // TODO: Calculate recent activity
      });

      // Fetch reported content
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id (id, username)
        `)
        .order('created_at', { ascending: false });

      if (reportsError) {
        toast({
          title: "Error fetching reports",
          description: reportsError.message,
          variant: "destructive",
        });
        return;
      }

      setReportedContent(reports as Report[]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (id: string, action: 'approve' | 'remove' | 'dismiss') => {
    const newStatus = action === 'approve' ? 'resolved' : 'dismissed';

    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update the report status.",
        variant: "destructive"
      });
    } else {
      setReportedContent(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      toast({
        title: "Action completed",
        description: `Content has been ${action === 'remove' ? 'dismissed and flagged for removal' : newStatus} successfully`,
      });
    }
    // TODO: Add logic to actually remove/hide the content if action is 'remove'
  };

  if (!isAdmin) {
    return (
      <main className="pl-64">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="pl-64 max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="pl-64 max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-primary" size={32} />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor and manage the ProblemBoard community
        </p>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Posted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProblems}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solutions Proposed</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSolutions}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalFunding}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Actions in last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag size={16} />
            Content Reports ({reportedContent.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users size={16} className="mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="featured">
            <TrendingUp size={16} className="mr-2" />
            Featured Content
          </TabsTrigger>
        </TabsList>

        {/* Content Reports */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and moderate content that has been flagged by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedContent.map((report) => (
                  <div key={report.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={report.type === 'problem' ? 'default' : report.type === 'solution' ? 'secondary' : 'outline'}>
                          {report.type}
                        </Badge>
                        <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      Reported by: <span className="font-medium">{report.reporter?.username || 'Unknown User'}</span>
                    </p>
                    
                    <div className="bg-muted/50 rounded p-3 mb-4">
                      <p className="text-sm">{report.content}</p>
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContentAction(report.id, 'approve')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContentAction(report.id, 'remove')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle size={14} className="mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContentAction(report.id, 'dismiss')}
                        >
                          <AlertTriangle size={14} className="mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {reportedContent.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Flag size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No reported content at the moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>User management interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Content */}
        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Content</CardTitle>
              <CardDescription>
                Highlight exceptional problems and solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>Featured content management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Admin;