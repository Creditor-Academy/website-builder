import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createCareersPage } from "@/lib/defaultPageData";

const Careers = () => {
  return (
    <>
      <Helmet>
        <title>Careers - Web Studio</title>
        <link rel="canonical" href="https://webstudio.lmsathena.com/careers" />
        <meta name="description" content="Careers" />
      </Helmet>
      <WebsiteEditor initialPage={createCareersPage()} />
    </>
  );
};

export default Careers;
