import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createStartPage } from "@/lib/defaultPageData";

const Start = () => {
  return (
    <>
      <Helmet>
        <title>Get Started - Web Studio</title>
        <link rel="canonical" href="https://webstudio.lmsathena.com/start" />
        <meta name="description" content="Get started" />
      </Helmet>
      <WebsiteEditor initialPage={createStartPage()} />
    </>
  );
};

export default Start;
