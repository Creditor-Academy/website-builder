import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStartPage } from "@/lib/defaultPageData";

const Start = () => {
  return (
    <>
      <Helmet>
        <title>Get Started - SiteBuilder</title>
        <meta name="description" content="Get started" />
      </Helmet>
      <WebsiteEditor initialPage={createStartPage()} />
    </>
  );
};

export default Start;
