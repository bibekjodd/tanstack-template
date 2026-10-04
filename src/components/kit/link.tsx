import { Link } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;

// An anchor that does the right thing for where it points: a router link for a page of this site
// ("/pricing"), a plain anchor for "#section", "mailto:", "tel:" and other sites. The sections in
// this folder use it for every href they render.
export function SmartLink({ href, children, ...props }: ComponentProps<'a'> & { href: string }) {
  if (EXTERNAL.test(href)) {
    const isOtherSite = /^(?:https?:)?\/\//i.test(href);
    return (
      <a
        href={href}
        {...(isOtherSite ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }
  // The route tree is generated and typed; a section cannot know its paths, so the check is skipped.
  return (
    <Link to={href as '/'} {...props}>
      {children}
    </Link>
  );
}
