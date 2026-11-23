import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createHelpPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Help = () => {
  return (
    <>
      <RouteHeading path="/help" />
      <WebsiteEditor initialPage={createHelpPage()} />
    </>
  );
};

export default Help;
