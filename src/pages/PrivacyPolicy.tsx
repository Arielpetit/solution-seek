import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Your privacy is important to us. This Privacy Policy explains how ProblemHub collects, uses, and protects your personal information.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, post a problem, propose a solution, or contact customer support. This may include your name, email address, username, and profile information.
          </p>
          <p>
            We also collect certain information automatically when you access and use ProblemHub, such as your IP address, device information, browser type, and usage data.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, maintain, and improve ProblemHub's services.</li>
            <li>Process your transactions and requests.</li>
            <li>Communicate with you about problems, solutions, and platform updates.</li>
            <li>Personalize your experience on ProblemHub.</li>
            <li>Detect, prevent, and address technical issues and security incidents.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information Sharing and Disclosure</h2>
          <p>
            We do not share your personal information with third parties except in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>With your consent.</li>
            <li>For legal reasons, such as to comply with a subpoena or court order.</li>
            <li>To protect the rights, property, or safety of ProblemHub, our users, or the public.</li>
            <li>With service providers who perform services on our behalf, such as hosting, data analysis, and customer service.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Choices</h2>
          <p>
            You can access, update, or delete your account information at any time through your profile settings. You can also opt out of receiving promotional communications from us.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;