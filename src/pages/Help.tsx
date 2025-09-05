import React from 'react';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Welcome to the ProblemHub Help Center. Here you can find answers to common questions and resources to guide you through the platform.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
          <p>
            If you're new to ProblemHub, start by exploring the main feed to see problems posted by other users. You can upvote problems you care about, propose solutions, and even collaborate with others.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Posting a Problem</h2>
          <p>
            To post a problem, navigate to the "Post Problem" section from the sidebar. Provide a clear title, a detailed description, and select a relevant category. You can also add an image to illustrate your problem.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Collaborating on Solutions</h2>
          <p>
            Find a solution you're passionate about? Send a collaboration request! Once accepted, you can join a team chat to discuss and work together on the solution.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Funding Solutions</h2>
          <p>
            Support problems and solutions you believe in by contributing funds. Your contributions help developers bring innovative solutions to life.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Account Management</h2>
          <p>
            Manage your profile, change your password, and review your posts from your profile page.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Still need help?</h2>
          <p>
            If you can't find what you're looking for, please reach out to our support team through the contact information provided in the "About ProblemHub" page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Help;