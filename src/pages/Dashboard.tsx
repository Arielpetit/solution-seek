import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useNotify } from '@/hooks/useNotify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from 'lucide-react';

interface CollaborationRequest {
  id: string;
  status: string;
  solutions: {
    id: string;
    title: string;
    problems: {
      id: string;
      title: string;
    } | null;
  } | null;
  profiles: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  } | null;
}

interface SolutionWithFunding {
  id: string;
  title: string;
  solution_funding: { amount: number }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const { createNotification } = useNotify();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [mySolutions, setMySolutions] = useState<SolutionWithFunding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCollaborationRequests();
      fetchMySolutions();
    }
  }, [user]);

  const fetchMySolutions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select(`
          id,
          title,
          solution_funding (amount)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setMySolutions(data as SolutionWithFunding[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch your solutions.", variant: "destructive" });
    }
  };

  const fetchCollaborationRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('solution_collaborators')
        .select(`
          id,
          status,
          solutions (
            id,
            title,
            problems (id, title)
          ),
          profiles (id, full_name, username, avatar_url)
        `)
        .eq('solutions.user_id', user.id);

      if (error) throw error;
      setRequests(data as CollaborationRequest[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch collaboration requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestStatusChange = async (requestId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('solution_collaborators')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      toast({ title: "Success", description: `Request has been ${newStatus}.` });

      if (newStatus === 'accepted' && user) {
        const request = requests.find(r => r.id === requestId);
        if (request?.profiles?.id && request?.solutions?.id) {
          createNotification(
            request.profiles.id,
            'collaboration_accepted',
            { solution_title: request.solutions.title || '' },
            user.id,
            `/problem/${request.solutions.problems?.id}`
          );
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update request status.", variant: "destructive" });
    }
  };
  
  const RequestCard = ({ request }: { request: CollaborationRequest }) => (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={request.profiles?.avatar_url} />
            <AvatarFallback>{request.profiles?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{request.profiles?.full_name}</p>
            <p className="text-sm text-muted-foreground">wants to collaborate on your solution:</p>
            <p className="text-sm font-medium">{request.solutions?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {request.status === 'pending' ? (
            <>
              <Button size="sm" variant="outline" className="text-green-500" onClick={() => handleRequestStatusChange(request.id, 'accepted')}>
                <Check size={16} />
              </Button>
              <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleRequestStatusChange(request.id, 'rejected')}>
                <X size={16} />
              </Button>
            </>
          ) : (
            <Badge variant={request.status === 'accepted' ? 'default' : 'destructive'}>{request.status}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MySolutions = ({ solutions }: { solutions: SolutionWithFunding[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>My Solutions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {solutions.map(solution => (
          <Card key={solution.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <p className="font-semibold">{solution.title}</p>
              <div className="text-right">
                <p className="font-bold text-lg text-green-500">
                  ${solution.solution_funding.reduce((acc, f) => acc + f.amount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {solution.solution_funding.length} backers
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {solutions.length === 0 && <p>You have not proposed any solutions yet.</p>}
      </CardContent>
    </Card>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Collaboration Requests</TabsTrigger>
          <TabsTrigger value="solutions">My Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? <p>Loading...</p> : requests.filter(r => r.status === 'pending').map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
              {!loading && requests.filter(r => r.status === 'pending').length === 0 && <p>No pending requests.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="solutions">
          {loading ? <p>Loading...</p> : <MySolutions solutions={mySolutions} />}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Dashboard;