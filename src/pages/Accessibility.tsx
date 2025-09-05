import React from 'react';

const Accessibility = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>
      <p className="text-lg text-muted-foreground mb-4">
        ProblemHub is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
          <p>
            We are working to make ProblemHub as accessible as possible. Our ongoing efforts include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Designing with accessibility in mind from the start.</li>
            <li>Regularly reviewing our website and application to identify and fix accessibility issues.</li>
            <li>Providing accessible alternatives where necessary.</li>
            <li>Training our team on accessibility best practices.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Accessibility Features</h2>
          <p>
            Some of the accessibility features we aim to provide or are currently implementing include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Keyboard Navigation:** Ensuring all interactive elements can be accessed and operated using a keyboard.</li>
            <li>**Screen Reader Compatibility:** Providing clear and semantic HTML to ensure compatibility with screen readers.</li>
            <li>**Color Contrast:** Maintaining sufficient color contrast for text and interactive elements.</li>
            <li>**Resizable Text:** Allowing users to adjust text size without loss of content or functionality.</li>
            <li>**Alternative Text for Images:** Providing descriptive alternative text for all meaningful images.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of ProblemHub. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Email: <a href="mailto:accessibility@problemhub.com" className="text-primary hover:underline">accessibility@problemhub.com</a></li>
            <li>Phone: [Your Phone Number] (if applicable)</li>
          </ul>
          <p className="mt-2">
            We will do our best to address your concerns and make our platform more accessible.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Accessibility;