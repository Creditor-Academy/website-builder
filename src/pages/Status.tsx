import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStatusPage } from "@/lib/defaultPageData";

const Status = () => {
  return (
    <>
      <Helmet>
        <title>Status - Web Studio</title>
        <meta name="description" content="System status" />
      </Helmet>
      <WebsiteEditor initialPage={createStatusPage()} />
    </>
  );
};

export default Status;
