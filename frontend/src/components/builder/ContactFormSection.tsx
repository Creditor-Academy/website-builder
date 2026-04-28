import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import contactApi from '@/api/contact';

interface ContactFormSectionProps {
  websiteId: string;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  darkMode?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function ContactFormSection({
  websiteId,
  title = "Get in Touch",
  description = "Have a question or want to work together? Send us a message!",
  buttonText = "Send Message",
  className,
  darkMode = false,
  onSuccess,
  onError
}: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteId) {
      onError?.('Website is not connected. Please publish or reload this page and try again.');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      onError?.('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await contactApi.submitContactForm({
        websiteId,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (response.data?.success) {
        setIsSubmitted(true);
        onSuccess?.('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Trigger message update event to refresh dashboard badge
        window.dispatchEvent(new CustomEvent('messageUpdate'));
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        onError?.(response.data?.message || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(
      "py-16 px-6",
      darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "text-lg",
              darkMode ? "text-slate-300" : "text-slate-600"
            )}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-3xl p-8 md:p-12 shadow-2xl",
            darkMode 
              ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700" 
              : "bg-white border border-slate-200"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-semibold flex items-center gap-2",
                  darkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  <User className="w-4 h-4" />
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className={cn(
                    "w-full h-12 px-4 rounded-xl border-2 outline-none transition-all font-medium",
                    darkMode 
                      ? "bg-slate-900/50 border-slate-600 focus:border-blue-500 text-white placeholder:text-slate-500" 
                      : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-semibold flex items-center gap-2",
                  darkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className={cn(
                    "w-full h-12 px-4 rounded-xl border-2 outline-none transition-all font-medium",
                    darkMode 
                      ? "bg-slate-900/50 border-slate-600 focus:border-blue-500 text-white placeholder:text-slate-500" 
                      : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-semibold flex items-center gap-2",
                darkMode ? "text-slate-300" : "text-slate-700"
              )}>
                <MessageSquare className="w-4 h-4" />
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                className={cn(
                  "w-full h-12 px-4 rounded-xl border-2 outline-none transition-all font-medium",
                  darkMode 
                    ? "bg-slate-900/50 border-slate-600 focus:border-blue-500 text-white placeholder:text-slate-500" 
                    : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-semibold flex items-center gap-2",
                darkMode ? "text-slate-300" : "text-slate-700"
              )}>
                <MessageSquare className="w-4 h-4" />
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or question..."
                rows={6}
                required
                className={cn(
                  "w-full p-4 rounded-xl border-2 outline-none transition-all font-medium resize-none",
                  darkMode 
                    ? "bg-slate-900/50 border-slate-600 focus:border-blue-500 text-white placeholder:text-slate-500" 
                    : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group/button-contact shadow-xl",
                isSubmitted 
                  ? "bg-green-500 text-white" 
                  : (darkMode 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-slate-900 text-white hover:bg-blue-600")
              )}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                />
              ) : isSubmitted ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Message Sent
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5 group-hover/button-contact:translate-x-1 transition-transform" />
                  {buttonText}
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
