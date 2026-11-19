import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createServicesPage } from "@/lib/defaultPageData";

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Services - Web Studio</title>
        <link rel="canonical" href="https://webstudio.lmsathena.com/services" />
        <meta name="description" content="Services we provide" />
      </Helmet>
      <WebsiteEditor initialPage={createServicesPage()} />
    </>
  );
};

export default Services;
