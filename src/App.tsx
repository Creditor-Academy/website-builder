import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense } from "react";

const Index = React.lazy(() => import("./pages/Index"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const DashboardUsers = React.lazy(() => import("./pages/DashboardUsers"));
const DashboardWebsites = React.lazy(() => import("./pages/DashboardWebsites"));
const DashboardTemplates = React.lazy(() => import("./pages/DashboardTemplates"));
const DashboardDeployment = React.lazy(() => import("./pages/DashboardDeployment"));
const DashboardAssets = React.lazy(() => import("./pages/DashboardAssets"));
const DashboardSettings = React.lazy(() => import("./pages/DashboardSettings"));
const TemplateEditor = React.lazy(() => import("./pages/TemplateEditor"));
const Organizations = React.lazy(() => import("./pages/dashboard/Organizations"));
const WebsiteEditor = React.lazy(() => import("./components/editor/WebsiteEditor").then(m => ({ default: m.WebsiteEditor })));
const Login = React.lazy(() => import("./pages/Login"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const Features = React.lazy(() => import("./pages/Features"));
const Services = React.lazy(() => import("./pages/Services"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Start = React.lazy(() => import("./pages/Start"));
const Templates = React.lazy(() => import("./pages/Templates"));
const Resources = React.lazy(() => import("./pages/Resources"));
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Help = React.lazy(() => import("./pages/Help"));
const Status = React.lazy(() => import("./pages/Status"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const GoogleCallback = React.lazy(() => import("./pages/GoogleCallback"));
const DashboardMessages = React.lazy(() => import("./pages/DashboardMessages"));

import { ScrollToTop } from "./components/utils/ScrollToTop";
import { JumpToTop } from "./components/ui/JumpToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <JumpToTop />
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={null} />
                <Route path="users" element={<DashboardUsers />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="websites" element={<DashboardWebsites />} />
                <Route path="templates" element={<DashboardTemplates />} />
                <Route path="deployment" element={<DashboardDeployment />} />
                <Route path="assets" element={<DashboardAssets />} />
                <Route path="messages" element={<DashboardMessages />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>
              <Route path="/builder/:id" element={<WebsiteEditor />} />
              <Route path="/template-builder/:id" element={<TemplateEditor />} />
            </Route>
            <Route path="/features" element={<Features />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start" element={<Start />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/status" element={<Status />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
