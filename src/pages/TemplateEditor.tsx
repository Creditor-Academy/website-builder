import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import templateApi from '@/api/templates';
import useBuilderStore from '@/store/useBuilderStore';
import { WebsiteEditor } from '@/components/editor/WebsiteEditor';
import Loading from '@/components/Common/LoadingUI';

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewOnly = searchParams.get('preview') === '1';
  const { toast } = useToast();
  const startTemplateEditing = useBuilderStore((state) => state.startTemplateEditing);
  const stopTemplateEditing = useBuilderStore((state) => state.stopTemplateEditing);
  const setEditorState = useBuilderStore((state) => state.setEditorState);
  const createWebsite = useBuilderStore((state) => state.createWebsite);
  const templateEditor = useBuilderStore((state) => state.templateEditor);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

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
        if (previewOnly) {
          setEditorState({
            previewMode: true,
            showLeftPanel: false,
            showRightPanel: false,
            tour: { isActive: false, step: 0, isFinished: true },
          });
        }
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        toast({
          title: previewOnly ? 'Could not preview template' : 'Could not open template editor',
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
      if (previewOnly) {
        setEditorState({ previewMode: false, showLeftPanel: true, showRightPanel: true });
      }
      stopTemplateEditing();
    };
  }, [id, navigate, previewOnly, setEditorState, startTemplateEditing, stopTemplateEditing, toast]);

  const handleUseTemplate = async () => {
    if (!templateEditor || isCreating) return;
    try {
      setIsCreating(true);
      const websiteId = await createWebsite(`${templateEditor.name} Site`, templateEditor.id);
      setEditorState({ previewMode: false, showLeftPanel: true, showRightPanel: true });
      navigate(`/builder/${websiteId}`);
    } catch (error: any) {
      toast({
        title: 'Could not use template',
        description: error?.response?.data?.message || error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen label="Loading template editor" />;
  }

  if (!templateEditor) {
    return <Loading fullScreen label="Redirecting" />;
  }

  return previewOnly
    ? (
      <WebsiteEditor
        previewOnly
        isUsingTemplate={isCreating}
        onUseTemplate={() => void handleUseTemplate()}
      />
    )
    : <WebsiteEditor />;
}