import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createContactPage } from "@/lib/defaultPageData";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - SiteBuilder</title>
        <meta name="description" content="Contact us" />
      </Helmet>
      <WebsiteEditor initialPage={createContactPage()} />
    </>
  );
};

export default Contact;
