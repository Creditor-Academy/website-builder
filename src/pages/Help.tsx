import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createHelpPage } from "@/lib/defaultPageData";

const Help = () => {
  return (
    <>
      <Helmet>
        <title>Help - Web Studio</title>
        <link rel="canonical" href="https://webstudio.lmsathena.com/help" />
        <meta name="description" content="Help center" />
      </Helmet>
      <WebsiteEditor initialPage={createHelpPage()} />
    </>
  );
};

export default Help;
