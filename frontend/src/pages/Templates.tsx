import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createTemplatesPage } from "@/lib/defaultPageData";

const Templates = () => {
  return (
    <>
      <Helmet>
        <title>Templates - SiteBuilder</title>
        <meta name="description" content="Templates" />
      </Helmet>
      <WebsiteEditor initialPage={createTemplatesPage()} />
    </>
  );
};

export default Templates;
