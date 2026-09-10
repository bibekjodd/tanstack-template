import { Providers } from '@/components/providers';
import { themeInitScript } from '@/lib/theme-script';
import appCss from '@/styles/app.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { ReactNode } from 'react';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start' },
      {
        name: 'description',
        content: 'A TanStack Start starter with shadcn/ui, Tailwind v4 tokens, and TanStack Query.'
      }
    ],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  errorComponent: RootErrorBoundary,
  notFoundComponent: RootNotFound,
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
        {import.meta.env.DEV ? <TanStackRouterDevtools position="bottom-right" /> : null}
        <Scripts />
      </body>
    </html>
  );
}

function RootErrorBoundary({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-foreground text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        {message || 'An unexpected error occurred while rendering this page.'}
      </p>
    </div>
  );
}

function RootNotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-foreground text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground text-sm">
        The page you're looking for doesn't exist or has moved.
      </p>
    </div>
  );
}
