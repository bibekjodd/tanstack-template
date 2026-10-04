import { ErrorState, NotFoundState } from '@/components/kit/route-states';
import { Providers } from '@/components/providers';
import { SITE, seo } from '@/lib/seo';
import { themeInitScript } from '@/lib/theme-script';
import appCss from '@/styles/app.css?url';
import kitCss from '@/styles/kit.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const base = seo();
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'theme-color',
          content: SITE.themeColor.light,
          media: '(prefers-color-scheme: light)'
        },
        {
          name: 'theme-color',
          content: SITE.themeColor.dark,
          media: '(prefers-color-scheme: dark)'
        },
        ...base.meta
      ],
      links: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'stylesheet', href: appCss },
        { rel: 'stylesheet', href: kitCss }
      ]
    };
  },
  errorComponent: ({ error, reset }) => <ErrorState error={error} reset={reset} />,
  notFoundComponent: () => <NotFoundState />,
  component: RootLayout,
  shellComponent: RootDocument
});

function RootLayout() {
  return <Outlet />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  );
}
