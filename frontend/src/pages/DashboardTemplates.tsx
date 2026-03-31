import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBuilderStore from '@/store/useBuilderStore';
import { templatesList } from '@/lib/templates';
import { cn } from '@/lib/utils';

export default function DashboardTemplates() {
  const navigate = useNavigate();
  const createWebsite = useBuilderStore(state => state.createWebsite);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Business' | 'E-commerce' | 'Personal'>('All');

  const handleUseTemplate = (templateId: string, title: string) => {
    const id = createWebsite(`${title} Site`, templateId);
    navigate(`/builder/${id}`);
  };

  const handleCategoryClick = (category: 'All' | 'Business' | 'E-commerce' | 'Personal') => {
    setActiveCategory(category);
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[80vh]">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> / <span className="font-semibold text-slate-700">Templates</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Templates Library</h2>
          <p className="text-slate-500 mt-1">Choose a professional starting point for your next digital venture.</p>
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Business', 'E-commerce', 'Personal'].map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={cn(
                "rounded-full h-10 px-4 text-sm font-semibold transition-all duration-200",
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700"
              )}
              onClick={() => handleCategoryClick(cat as 'All' | 'Business' | 'E-commerce' | 'Personal')}
            >
              {cat}
            </Button>
          ))}
        </div> 
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {templatesList
          .filter(template => activeCategory === 'All' || template.category === activeCategory)
          .map((template) => (
          <Card key={template.id} className="group/template-card overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white">
            <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden rounded-t-2xl">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/template-card:scale-105" 
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/template-card:opacity-100 transition-opacity duration-300"></div>
              
              {template.tag && (
                <Badge className="absolute top-4 left-4 bg-white/90 text-slate-800 font-semibold text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-[2px]">
                  {template.tag}
                </Badge>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/template-card:opacity-100 transition-all duration-300 z-20">
                <Button 
                   className="bg-blue-600 text-white font-semibold rounded-full px-6 h-11 text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                   onClick={(e) => { e.stopPropagation(); handleUseTemplate(template.id, template.name); }}
                >
                   <Plus className="w-4 h-4 mr-2" /> Start Building
                </Button>
              </div>
            </div>
            
            <CardHeader className="p-6 pt-4 pb-2">
              <div className="flex justify-between items-start mb-2">
                 <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs">
                  {template.category}
                </Badge>
                <template.icon className="w-5 h-5 text-slate-400" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 leading-tight mt-1">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                {template.desc}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-xs uppercase tracking-wider group-hover/template-card:text-blue-700 transition-all"> 
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </Card>
  );
}