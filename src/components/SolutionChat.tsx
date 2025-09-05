import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface SolutionChatProps {
  solutionId: string;
}

const SolutionChat = ({ solutionId }: SolutionChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel(`solution_chat_${solutionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'solution_chat_messages',
          filter: `solution_id=eq.${solutionId}`,
        },
        (payload) => {
          // Manually fetch the new message with profile data
          fetchMessageById(payload.new.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [solutionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('solution_chat_messages')
      .select(`
        id,
        created_at,
        content,
        user_id,
        profiles (full_name, avatar_url)
      `)
      .eq('solution_id', solutionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data as unknown as ChatMessage[]);
    }
  };

  const fetchMessageById = async (messageId: string) => {
    const { data, error } = await supabase
      .from('solution_chat_messages')
      .select(`
        id,
        created_at,
        content,
        user_id,
        profiles (full_name, avatar_url)
      `)
      .eq('id', messageId)
      .single();

    if (error) {
      console.error('Error fetching new message:', error);
    } else {
      setMessages((prevMessages) => [...prevMessages, data as unknown as ChatMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const { error } = await supabase.from('solution_chat_messages').insert({
      solution_id: solutionId,
      user_id: user.id,
      content: newMessage.trim(),
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.user_id === user?.id ? 'justify-end' : ''
            }`}
          >
            {msg.user_id !== user?.id && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.profiles?.avatar_url} />
                <AvatarFallback>
                  {msg.profiles?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-xs ${
                msg.user_id === user?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
              </p>
            </div>
            {msg.user_id === user?.id && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>
                  {user.user_metadata.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-0 resize-none"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SolutionChat;