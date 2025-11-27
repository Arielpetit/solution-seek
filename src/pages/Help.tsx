import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-primary tracking-tight">How Can We Help You?</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to the ProblemHub Help Center. Find answers to common questions and resources to guide you through the platform.
        </p>
      </div>
      <Accordion type="multiple" className="w-full space-y-4">
        <Card>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Getting Started</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                If you're new to ProblemHub, start by exploring the main feed to see problems posted by other users. You can upvote problems you care about, propose solutions, and even collaborate with others.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
        <Card>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Posting a Problem</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                To post a problem, navigate to the "Post Problem" section from the sidebar. Provide a clear title, a detailed description, and select a relevant category. You can also add an image to illustrate your problem.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
        <Card>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Collaborating on Solutions</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                Find a solution you're passionate about? Send a collaboration request! Once accepted, you can join a team chat to discuss and work together on the solution.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
        <Card>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Funding Solutions</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                Support problems and solutions you believe in by contributing funds. Your contributions help developers bring innovative solutions to life.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
        <Card>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Account Management</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                Manage your profile, change your password, and review your posts from your profile page.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
        <Card>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-2xl font-bold px-6 py-4">Still need help?</AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                If you can't find what you're looking for, please reach out to our support team through the contact information provided in the "About ProblemHub" page.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </div>
  );
};

export default Help;