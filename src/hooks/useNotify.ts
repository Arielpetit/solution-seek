import { supabase } from '@/integrations/supabase/client';

type NotificationType = 'new_comment' | 'new_solution' | 'collaboration_request' | 'collaboration_accepted';

interface NotificationData {
  [key: string]: any;
}

export const useNotify = () => {
  const createNotification = async (
    userId: string,
    type: NotificationType,
    data: NotificationData,
    sourceUserId: string,
    linkTo: string
  ) => {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      type,
      data,
      source_user_id: sourceUserId,
      link_to: linkTo,
    });

    if (error) {
      console.error('Error creating notification:', error);
      return error;
    }

    return null;
  };

  return { createNotification };
};