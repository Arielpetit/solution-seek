import React from 'react';

const ProblemHubRules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ProblemHub Community Rules</h1>
      <p className="text-lg text-muted-foreground mb-4">
        To ensure a positive and productive environment for everyone, please adhere to the following community guidelines.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Be Respectful and Constructive</h2>
          <p>
            Treat all users with respect, even if you disagree with their ideas. Focus on constructive feedback and avoid personal attacks, harassment, or hate speech.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Keep it Relevant</h2>
          <p>
            Ensure your problems, solutions, and comments are relevant to the topic at hand. Off-topic discussions can detract from the community's focus.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. No Spam or Self-Promotion</h2>
          <p>
            Do not post unsolicited advertisements, spam, or excessive self-promotional content. The goal is to solve problems, not to market your services unrelated to a solution.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Protect Privacy</h2>
          <p>
            Do not share personal or confidential information about yourself or others. Respect the privacy of all community members.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Report Inappropriate Content</h2>
          <p>
            If you encounter any content that violates these rules, please report it using the provided tools. Our moderators will review and take appropriate action.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Follow Copyright Laws</h2>
          <p>
            Ensure that any content you post (text, images, code) respects copyright and intellectual property laws. Only share content you have the right to distribute.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Consequences of Violations</h2>
          <p>
            Violations of these rules may result in content removal, temporary suspension, or permanent banning from the ProblemHub platform, at the discretion of our moderation team.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProblemHubRules;