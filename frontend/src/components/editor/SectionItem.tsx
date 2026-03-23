import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2, Layout, Sparkles, Grid3X3, Image, MessageSquare, BarChart2, Users, HelpCircle, Building2, DollarSign, Mail, Quote, MoreVertical, Info, FileText, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const sectionIcons = { hero: Sparkles, features: Grid3X3, services: Layout, cta: MessageSquare, testimonials: Quote, gallery: Image, pricing: DollarSign, contact: Mail, stats: BarChart2, team: Users, faq: HelpCircle, logocloud: Building2, custom: Layout, about: Info };
const sectionColors = { hero: 'from-blue-500 to-blue-600', features: 'from-purple-500 to-purple-600', services: 'from-green-500 to-green-600', cta: 'from-amber-500 to-amber-600', testimonials: 'from-pink-500 to-pink-600', gallery: 'from-cyan-500 to-cyan-600', pricing: 'from-indigo-500 to-indigo-600', contact: 'from-rose-500 to-rose-600', stats: 'from-teal-500 to-teal-600', team: 'from-orange-500 to-orange-600', faq: 'from-violet-500 to-violet-600', logocloud: 'from-slate-500 to-slate-600', custom: 'from-gray-500 to-gray-600', about: 'from-emerald-500 to-emerald-600' };

export function SectionItem({ id, name, type, visible, isSelected, onClick }) {
  const { toggleSectionVisibility, duplicateSection, deleteSection } = useBuilder();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = sectionIcons[type] || Layout;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer border ${isSelected
        ? 'bg-primary/5 border-primary/30 shadow-sm shadow-primary/5 translate-x-1'
        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50'
        } ${isDragging ? 'opacity-40 scale-95 shadow-2xl z-50' : ''} ${!visible ? 'opacity-60 bg-slate-50' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-slate-100 transition-colors">
        <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
      </div>

      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionColors[type]} flex items-center justify-center flex-shrink-0 shadow-sm shadow-black/5 group-hover:scale-110 transition-transform`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-primary' : 'text-slate-700'}`}>{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{type}</span>
          {!visible && (
            <span className="text-[10px] text-amber-500 font-semibold px-1.5 py-0 rounded bg-amber-50 border border-amber-100/50 flex items-center gap-1">
              Hidden
            </span>
          )}
        </div>
      </div>

      <div className={`flex items-center transition-all transform ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} translate-x-1 group-hover:translate-x-0`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
            <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(id); }}>
              {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {visible ? 'Hide Section' : 'Show Section'}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); duplicateSection(id); }}>
              <Copy className="w-4 h-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive rounded-lg" onClick={(e) => { e.stopPropagation(); deleteSection(id); }}>
              <Trash2 className="w-4 h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
