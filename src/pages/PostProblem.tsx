import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { value: "finance", label: "Finance & Money" },
    { value: "health", label: "Health & Wellness" },
    { value: "productivity", label: "Productivity & Work" },
    { value: "technology", label: "Technology & Apps" },
    { value: "lifestyle", label: "Lifestyle & Daily Life" },
    { value: "other", label: "Other" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Problem Posted Successfully!",
        description: "Your problem has been shared with the community."
      });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plus className="text-primary" size={32} />
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Share Your Problem
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Help entrepreneurs and builders discover real problems worth solving
          </p>
        </div>

        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary" size={20} />
              What problem are you facing?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Be specific and detailed. The more context you provide, the better entrepreneurs can understand and solve it.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title *</Label>
                <Input
                  id="title"
                  placeholder="Describe your problem in one clear sentence..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background border-border"
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/150 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose a category that best fits your problem" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Explain your problem in detail. What exactly happens? When does it occur? How does it affect you? What have you tried already?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background border-border min-h-[150px] resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/1000 characters
                </p>
              </div>

              <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
                <h4 className="font-medium text-foreground mb-2">💡 Tips for a great problem post:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about when and where the problem occurs</li>
                  <li>• Explain why current solutions don't work for you</li>
                  <li>• Mention who else might face this same problem</li>
                  <li>• Include any workarounds you've tried</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-primary hover:shadow-primary transition-all duration-300"
                >
                  {isSubmitting ? "Posting..." : "Post Problem"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="px-8"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostProblem;