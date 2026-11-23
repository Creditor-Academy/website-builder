import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createPricingPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Pricing = () => {
  return (
    <>
      <RouteHeading path="/pricing" />
      <WebsiteEditor initialPage={createPricingPage()} />
    </>
  );
};

export default Pricing;
