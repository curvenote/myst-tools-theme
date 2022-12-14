import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import type { SiteLoader } from '@curvenote/site';
import { KatexCSS, responseNoSite } from '@curvenote/site';
import { Outlet, useLoaderData } from '@remix-run/react';
import { ArticlePageCatchBoundary } from '@curvenote/site';
import { NavigationAndFooter } from '../components/Page';
import { getArticleConfig } from '../utils/loaders.server';
import { SiteProvider } from '@curvenote/ui-providers';

type ArticleConfig = Omit<SiteLoader, 'theme'>;

export const loader: LoaderFunction = async ({ params, request }): Promise<ArticleConfig> => {
  const { project } = params;
  if (!project) throw responseNoSite();
  const [config] = await Promise.all([getArticleConfig(project).catch(() => null)]);
  if (!config) throw responseNoSite();
  const data = { config };
  return data;
};

export const links: LinksFunction = () => [KatexCSS];

export default function LandingPage() {
  const { config } = useLoaderData<ArticleConfig>();
  return (
    <NavigationAndFooter>
      <SiteProvider config={config}>
        <Outlet />
      </SiteProvider>
    </NavigationAndFooter>
  );
}

export function CatchBoundary() {
  return (
    <NavigationAndFooter>
      <main className="article-content">
        <ArticlePageCatchBoundary />
      </main>
    </NavigationAndFooter>
  );
}
