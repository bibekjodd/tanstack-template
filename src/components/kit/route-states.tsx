import { Link, useRouter } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * @kit name: ErrorState, NotFoundState, PendingState
 * @kit group: layout
 * @kit use: The screens for a route that failed to render, a page that does not exist, and a route that is still loading. Wired into the root route and the router already; use them again for a route's own errorComponent, notFoundComponent or pendingComponent.
 * @kit props: ErrorState { error, reset }, NotFoundState { title, description }, PendingState {}
 * @kit example: <Route.. errorComponent={({ error }) => <ErrorState error={error} />} notFoundComponent={() => <NotFoundState title="No such recipe" />} />
 */
export function ErrorState({ error, reset }: { error?: unknown; reset?: () => void }) {
  const router = useRouter();
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Error</p>
      <h1 className="font-heading text-3xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        {message || 'An unexpected error occurred while showing this page.'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => (reset ? reset() : router.invalidate())}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <RefreshCw className="size-4" /> Try again
        </button>
        <Link
          to="/"
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" /> Back home
        </Link>
      </div>
    </div>
  );
}

export function NotFoundState({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or has moved."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">404</p>
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Link
        to="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" /> Back home
      </Link>
    </div>
  );
}

export function PendingState() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-svh items-center justify-center">
      <div className="border-border border-t-primary size-7 animate-spin rounded-full border-2" />
    </div>
  );
}
