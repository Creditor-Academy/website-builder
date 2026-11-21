import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStatusPage } from "@/lib/defaultPageData";

const Status = () => {
  return <WebsiteEditor initialPage={createStatusPage()} />;
};

export default Status;
