
"use client";

import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGetFaqsQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";

export function FaqSection() {
  const { data: faqs = [], isLoading } = useGetFaqsQuery({ approvedOnly: true });
  const [faqLimit, setFaqLimit] = React.useState(5);

  React.useEffect(() => {
    const savedLimit = localStorage.getItem('faq_limit');
    if (savedLimit && !isNaN(parseInt(savedLimit, 10))) {
      setFaqLimit(parseInt(savedLimit, 10));
    }
  }, []);

  const displayedFaqs = faqs.slice(0, faqLimit);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );
    }
    
    if (displayedFaqs.length === 0) {
      return <EmptyState title="No FAQs Available" description="Check back later for frequently asked questions."/>
    }
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {displayedFaqs.map((faq: any, index: number) => (
          <AccordionItem key={faq._id} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mx-auto max-w-3xl">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
