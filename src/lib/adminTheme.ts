/** Admin right-panel palette (sidebar unchanged). */
export const adminTheme = {
  primary: '#0F172A',
  primaryHover: '#1E293B',
  secondary: '#747781',
  tertiary: '#231500',
  neutral: '#787778',
  border: '#E8E8E8',
  surface: '#F4F4F5',
  surfaceHover: '#F8F8F9',
  white: '#FFFFFF',
} as const;

/** Common Tailwind class snippets for admin pages */
export const at = {
  pageCard: 'rounded-xl border border-[#E8E8E8] bg-white shadow-none p-8 min-h-[80vh]',
  pageCardSm: 'rounded-xl border border-[#E8E8E8] bg-white shadow-none p-8',
  heading: 'text-3xl font-bold text-[#0F172A] tracking-tight',
  subtext: 'text-[#747781] mt-1',
  breadcrumb: 'mb-4 text-sm text-[#747781]',
  breadcrumbActive: 'font-semibold text-[#0F172A]',
  primaryBtn:
    'bg-[#0F172A] text-white hover:bg-[#1E293B] hover:scale-100 rounded-full font-semibold shadow-none',
  outlineBtn:
    'bg-white text-[#0F172A] border border-[#E8E8E8] hover:bg-[#F4F4F5] hover:scale-100 rounded-full',
  filterActive: 'bg-[#0F172A] text-white shadow-none hover:bg-[#1E293B]',
  filterIdle: 'bg-white text-[#0F172A] border border-[#E8E8E8] hover:bg-[#F4F4F5]',
  searchInput:
    'rounded-full bg-white border-[#E8E8E8] shadow-none focus:ring-2 focus:ring-[#0F172A]/15 focus:border-[#0F172A]',
  avatar: 'bg-[#0F172A] text-white',
  iconChip: 'bg-[#F4F4F5] text-[#0F172A]',
  link: 'text-[#0F172A] font-bold hover:underline',
  label: 'text-[#747781]',
  muted: 'text-[#787778]',
  cardBorder: 'border border-[#E8E8E8] rounded-xl bg-white',
} as const;
