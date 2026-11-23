import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createAboutPage } from "@/lib/defaultPageData";

const About = () => {
  return <WebsiteEditor initialPage={createAboutPage()} />;
};

export default About;
