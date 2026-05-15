import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import templateApi from '@/api/templates';
import useBuilderStore from '@/store/useBuilderStore';
import { WebsiteEditor } from '@/components/editor/WebsiteEditor';

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const startTemplateEditing = useBuilderStore((state) => state.startTemplateEditing);
  const stopTemplateEditing = useBuilderStore((state) => state.stopTemplateEditing);
  const templateEditor = useBuilderStore((state) => state.templateEditor);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTemplate = async () => {
      if (!id) {
        navigate('/dashboard/templates');
        return;
      }

      try {
        setIsLoading(true);
        const res = await templateApi.getWebsiteTemplateById(id);
        const template = res.data?.data || res.data;

        if (!isMounted) {
          return;
        }

        startTemplateEditing(template);
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        toast({
          title: 'Could not open template editor',
          description: error?.response?.data?.message || error?.message || 'Please try again.',
          variant: 'destructive',
        });
        navigate('/dashboard/templates');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTemplate();

    return () => {
      isMounted = false;
      stopTemplateEditing();
    };
  }, [id, navigate, startTemplateEditing, stopTemplateEditing, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading template editor...</p>
        </div>
      </div>
    );
  }

  if (!templateEditor) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <WebsiteEditor />;
}