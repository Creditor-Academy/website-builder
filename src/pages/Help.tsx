import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createHelpPage } from "@/lib/defaultPageData";

const Help = () => {
  return <WebsiteEditor initialPage={createHelpPage()} />;
};

export default Help;
