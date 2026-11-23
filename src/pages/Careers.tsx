import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createCareersPage } from "@/lib/defaultPageData";

const Careers = () => {
  return <WebsiteEditor initialPage={createCareersPage()} />;
};

export default Careers;
