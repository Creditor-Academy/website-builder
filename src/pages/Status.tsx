import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStatusPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Status = () => {
  return (
    <>
      <RouteHeading path="/status" />
      <WebsiteEditor initialPage={createStatusPage()} />
    </>
  );
};

export default Status;
