import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createPricingPage } from "@/lib/defaultPageData";

const Pricing = () => {
  return <WebsiteEditor initialPage={createPricingPage()} />;
};

export default Pricing;
