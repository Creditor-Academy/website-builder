import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createBlogPage } from "@/lib/defaultPageData";
import { RouteHeading } from "@/seo/RouteHeading";

const Blog = () => {
  return (
    <>
      <RouteHeading path="/blog" />
      <WebsiteEditor initialPage={createBlogPage()} />
    </>
  );
};

export default Blog;
