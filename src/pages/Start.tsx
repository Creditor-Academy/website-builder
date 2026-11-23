import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStartPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Start = () => {
  return (
    <>
      <RouteHeading path="/start" />
      <WebsiteEditor initialPage={createStartPage()} />
    </>
  );
};

export default Start;
