import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createCareersPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Careers = () => {
  return (
    <>
      <RouteHeading path="/careers" />
      <WebsiteEditor initialPage={createCareersPage()} />
    </>
  );
};

export default Careers;
