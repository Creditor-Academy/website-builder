import { WebsiteEditor } from "@/components/editor/WebsiteEditor";
import { createBlogPage } from "@/lib/defaultPageData";

const Blog = () => {
  return <WebsiteEditor initialPage={createBlogPage()} />;
};

export default Blog;
