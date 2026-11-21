import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createServicesPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Services = () => {
  return (
    <>
      <RouteHeading path="/services" />
      <WebsiteEditor initialPage={createServicesPage()} />
    </>
  );
};

export default Services;
