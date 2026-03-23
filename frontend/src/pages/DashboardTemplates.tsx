import React from 'react';
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

  const handleUseTemplate = (templateId: string, title: string) => {
    const id = createWebsite(`${title} Site`, templateId);
    navigate(`/builder/${id}`);
  };

  return (
    <div className="p-4 md:p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary fill-primary/20" />
            </div>
            Templates Library
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg leading-relaxed">Choose a professional starting point for your next digital venture</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
          {['All', 'Business', 'E-commerce', 'Personal'].map(cat => (
            <Button key={cat} variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white hover:shadow-sm px-6 h-10 transition-all">
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {templatesList.map((template) => (
          <Card key={template.id} className="group overflow-hidden border-2 border-slate-100 hover:border-primary/40 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer bg-white">
            <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {template.tag && (
                <Badge className="absolute top-5 left-5 bg-primary text-white font-black text-[10px] px-3 py-1 tracking-[0.2em] uppercase rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md">
                  {template.tag}
                </Badge>
              )}
              
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-20 backdrop-blur-[4px]">
                <Button 
                   className="font-black bg-white text-slate-900 hover:bg-white hover:scale-105 transition-all shadow-2xl rounded-2xl px-8 h-12 text-sm tracking-tight uppercase" 
                   onClick={(e) => { e.stopPropagation(); handleUseTemplate(template.id, template.name); }}
                >
                   <Plus className="w-4 h-4 mr-2" /> Start Building
                </Button>
              </div>
            </div>
            
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  {template.category}
                </span>
                <template.icon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-none pt-1">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {template.desc}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Custom Template Card
        <div className="group border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/40 rounded-[2rem] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-12 text-center">
           <div className="w-16 h-16 rounded-[1.5rem] bg-white border-2 border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:scale-110">
              <Plus className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
           </div>
           <p className="text-lg font-black text-slate-900 tracking-tight">Custom Template</p>
           <p className="text-sm text-slate-400 font-medium mt-1">Start with a blank workspace</p>
        </div> */}
      </div>
    </div>
  );
}