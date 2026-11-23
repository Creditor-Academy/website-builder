import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createAboutPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const About = () => {
  return (
    <>
      <RouteHeading path="/about" />
      <WebsiteEditor initialPage={createAboutPage()} />
    </>
  );
};

export default About;
