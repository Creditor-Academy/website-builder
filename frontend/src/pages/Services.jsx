import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createServicesPage } from "@/lib/defaultPageData";

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Services - SiteBuilder</title>
        <meta name="description" content="Services we provide" />
      </Helmet>
      <WebsiteEditor initialPage={createServicesPage()} />
    </>
  );
};

export default Services;
