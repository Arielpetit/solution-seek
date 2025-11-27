import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  username: string;
  full_name: string;
  bio: string;
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  profile: Profile | null;
  onProfileUpdate: () => void;
}

const EditProfileModal = ({ isOpen, onClose, session, profile, onProfileUpdate }: EditProfileModalProps) => {
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
      setNewFullName(profile.full_name);
      setNewBio(profile.bio);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!session?.user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: newUsername,
        full_name: newFullName,
        bio: newBio,
      })
      .eq("id", session.user.id);

    setIsSaving(false);
    if (!error) {
      onProfileUpdate();
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <Input
              id="fullName"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bio">Bio</label>
            <Textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;