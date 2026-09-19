import { Helmet } from "react-helmet-async";
import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createBlogPage } from "@/lib/defaultPageData";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Web Studio</title>
        <meta name="description" content="Blog" />
      </Helmet>
      <WebsiteEditor initialPage={createBlogPage()} />
    </>
  );
};

export default Blog;
