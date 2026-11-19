import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStatusPage } from "@/lib/defaultPageData";

const Status = () => {
  return (
    <>
      <Helmet>
        <title>Status - Web Studio</title>
        <link rel="canonical" href="https://webstudio.lmsathena.com/status" />
        <meta name="description" content="System status" />
      </Helmet>
      <WebsiteEditor initialPage={createStatusPage()} />
    </>
  );
};

export default Status;
