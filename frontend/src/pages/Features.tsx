import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createFeaturesPage } from "@/lib/defaultPageData";

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features - SiteBuilder</title>
        <meta name="description" content="Features and product capabilities" />
      </Helmet>
      <WebsiteEditor initialPage={createFeaturesPage()} />
    </>
  );
};

export default Features;
