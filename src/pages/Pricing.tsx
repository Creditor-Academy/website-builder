import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createPricingPage } from "@/lib/defaultPageData";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - Web Studio</title>
        <meta name="description" content="Pricing plans" />
      </Helmet>
      <WebsiteEditor initialPage={createPricingPage()} />
    </>
  );
};

export default Pricing;
