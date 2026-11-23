import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createServicesPage } from "@/lib/defaultPageData";

const Services = () => {
  return <WebsiteEditor initialPage={createServicesPage()} />;
};

export default Services;
