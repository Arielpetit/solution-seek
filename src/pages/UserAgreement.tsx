import React from 'react';

const UserAgreement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Agreement</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Welcome to ProblemHub! By accessing or using our platform, you agree to be bound by the terms and conditions outlined in this User Agreement.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By creating an account, posting content, or otherwise using ProblemHub, you acknowledge that you have read, understood, and agree to be bound by this Agreement. If you do not agree, you may not use the platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use ProblemHub. By using the platform, you represent and warrant that you meet this age requirement.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to notify ProblemHub immediately of any unauthorized use of your account.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. User Content</h2>
          <p>
            You retain all ownership rights to the content you post on ProblemHub. However, by posting, you grant ProblemHub a worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, and display your content in connection with the platform's operation.
          </p>
          <p>
            You agree not to post content that is illegal, offensive, harmful, or infringes on the rights of others.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any activities that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate any laws or regulations.</li>
            <li>Interfere with the operation of ProblemHub.</li>
            <li>Attempt to gain unauthorized access to any part of the platform.</li>
            <li>Transmit viruses or other malicious code.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Termination</h2>
          <p>
            ProblemHub reserves the right to suspend or terminate your account at any time, with or without notice, for violations of this Agreement or for any other reason.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
          <p>
            ProblemHub is provided "as is" and "as available" without warranties of any kind, either express or implied.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p>
            ProblemHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
          <p>
            This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Changes to the Agreement</h2>
          <p>
            We may modify this Agreement at any time. Your continued use of ProblemHub after changes are posted constitutes your acceptance of the revised Agreement.
          </p>
        </section>
      </div>
    </div>
  );
};

export default UserAgreement;