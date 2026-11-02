import DynamicRootPage, { buildMetadata } from "../../[blog]/page";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  return buildMetadata(params.slug, true);
}

export default async function BlogPostPage({ params }) {
  return DynamicRootPage({ params: { blog: params.slug }, inBlogRoute: true });
}