
import BlogPostPage from '@/components/pages/blog-post-page';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} />;
}
