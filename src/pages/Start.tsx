import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStartPage } from "@/lib/defaultPageData";

const Start = () => {
  return <WebsiteEditor initialPage={createStartPage()} />;
};

export default Start;
