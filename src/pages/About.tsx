import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createAboutPage } from "@/lib/defaultPageData";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Web Studio</title>
        <meta name="description" content="About us" />
      </Helmet>
      <WebsiteEditor initialPage={createAboutPage()} />
    </>
  );
};

export default About;
