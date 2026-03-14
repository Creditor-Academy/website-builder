import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardWebsites from "./pages/DashboardWebsites";
import DashboardTemplates from "./pages/DashboardTemplates";
import DashboardDeployment from "./pages/DashboardDeployment";
import DashboardAssets from "./pages/DashboardAssets";
import DashboardSettings from "./pages/DashboardSettings";
import { WebsiteEditor } from "./components/editor/WebsiteEditor";
import Features from "./pages/Features";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Start from "./pages/Start";
import Templates from "./pages/Templates";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Status from "./pages/Status";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-right" />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={null} /> {/* This will be handled by Dashboard component's internal routing or default view */}
              <Route path="users" element={<DashboardUsers />} />
              <Route path="websites" element={<DashboardWebsites />} />
              <Route path="templates" element={<DashboardTemplates />} />
              <Route path="deployment" element={<DashboardDeployment />} />
              <Route path="assets" element={<DashboardAssets />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            <Route path="/builder/:id" element={<WebsiteEditor />} />
            <Route path="/features" element={<Features />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start" element={<Start />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/status" element={<Status />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
