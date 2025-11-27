import React from 'react';

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ProblemHub Blog</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Stay up-to-date with the latest news, updates, and insights from the ProblemHub team.
      </p>
      <div className="space-y-8">
        <article className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-2">Addressing Real-World Problems with Collaborative Solutions</h2>
          <p className="text-sm text-muted-foreground mb-3">Posted on September 1, 2025 by John Doe</p>
          <p className="text-base text-foreground">
            In this post, we discuss how ProblemHub empowers individuals and teams to tackle complex real-world issues by fostering a collaborative environment. We'll explore success stories and future plans.
          </p>
          <a href="#" className="text-primary hover:underline mt-3 inline-block">Read More</a>
        </article>
        <article className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-2">New Features Launched: Real-time Collaboration Chat!</h2>
          <p className="text-sm text-muted-foreground mb-3">Posted on August 25, 2025 by Jane Smith</p>
          <p className="text-base text-foreground">
            We are excited to announce the rollout of our new real-time collaboration chat feature. Connect with your team instantly and streamline your solution development process.
          </p>
          <a href="#" className="text-primary hover:underline mt-3 inline-block">Read More</a>
        </article>
        <article className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-2">The Importance of Upvoting and Community Feedback</h2>
          <p className="text-sm text-muted-foreground mb-3">Posted on August 15, 2025 by Mike Johnson</p>
          <p className="text-base text-foreground">
            Learn how your engagement through upvotes and comments helps shape the future of ProblemHub and highlights the most pressing issues.
          </p>
          <a href="#" className="text-primary hover:underline mt-3 inline-block">Read More</a>
        </article>
      </div>
    </div>
  );
};

export default Blog;