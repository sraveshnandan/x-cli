import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';

interface TOCItem {
  title: React.ReactNode;
  url: string;
  depth: number;
}
type TableOfContents = TOCItem[];

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as {
    body: React.ComponentType<Record<string, unknown>>;
    toc?: TableOfContents;
    full?: boolean;
    title: string;
    description: string;
  };
  const MDX = data.body;

  return (
    <DocsPage toc={data.toc} full={data.full as boolean}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as unknown as Record<string, unknown>;
  return {
    title: data.title as string,
    description: data.description as string,
  };
}