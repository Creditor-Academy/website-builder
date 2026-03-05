import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createHelpPage } from "@/lib/defaultPageData";

const Help = () => {
  return (
    <>
      <Helmet>
        <title>Help - SiteBuilder</title>
        <meta name="description" content="Help center" />
      </Helmet>
      <WebsiteEditor initialPage={createHelpPage()} />
    </>
  );
};

export default Help;
