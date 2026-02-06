import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "When will I get my server?",
      answer: "Since I manually review and create each server, it usually takes between 24 and 48 hours. You will receive your panel login credentials via Email or Discord once your server is ready."
    },
    {
      question: "Why is Skyserver free?",
      answer: "This is a non-profit student project. I created this platform to improve my skills in system administration and DevOps. There are no hidden costs or fees."
    },
    {
      question: "Is it safe?",
      answer: "Yes. Every game server runs in its own isolated Docker container. Your data is secure and separated from other servers."
    },
    {
      question: "How can I support the project?",
      answer: "The best way is to join our Discord community and provide feedback! You can also ask there how to support the project technically or financially (to help cover power costs)."
    }
  ];

  return (
    <section id="faq" className="relative py-20 px-6 bg-slate-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent" />
      
      <div className="relative max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Everything you need to know about Skyserver hosting.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-slate-800 rounded-xl bg-slate-900/50 backdrop-blur-sm px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-white hover:text-sky-400 transition-colors py-5 hover:no-underline">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <a
            href="https://discord.gg/4apa75XS9Q"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#5865F2', color: 'white' }}
          >
            <HelpCircle className="w-4 h-4" />
            Ask on Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
}