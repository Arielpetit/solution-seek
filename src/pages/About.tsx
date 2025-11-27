import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About ProblemHub</h1>
      <p className="text-lg text-muted-foreground mb-4">
        ProblemHub is a platform dedicated to fostering innovation and collaboration to solve real-world problems. We connect individuals with ideas to those who can build solutions.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p>
            Our mission is to empower a global community to identify, discuss, and collaboratively solve pressing issues. We believe that by working together, we can create meaningful impact and drive positive change.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Post Problems:** Share challenges you've identified in your community or the world.</li>
            <li>**Propose Solutions:** Offer innovative ideas and solutions to existing problems.</li>
            <li>**Collaborate:** Team up with other users to build and refine solutions.</li>
            <li>**Fund Projects:** Support solutions you believe in through direct funding.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Team</h2>
          <p>
            ProblemHub was founded by a passionate team of developers, designers, and problem-solvers committed to building a platform that makes a difference.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Email: <a href="mailto:support@problemhub.com" className="text-primary hover:underline">support@problemhub.com</a></li>
            <li>Twitter: <a href="https://twitter.com/problemhub" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@ProblemHub</a></li>
            <li>LinkedIn: <a href="https://linkedin.com/company/problemhub" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ProblemHub LinkedIn</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;