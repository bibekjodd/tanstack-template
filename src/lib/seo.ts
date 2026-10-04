// The head of a page: title, description and the share-card tags, in the shape a route's head()
// returns. Every route calls this so a page shared on a chat app or a social feed has a title, a
// description and a picture, not just the home page.
//
//   head: () => seo({ title: 'Pricing', description: 'Simple plans for every team.' })
export const SITE = {
  name: 'My site',
  titleSuffix: ' — My site',
  description: 'A website built with TanStack Start.',
  // Absolute path of the default share picture (1200x630) in public/.
  image: '/og.png',
  // The browser's address-bar colour, light and dark. The one place a literal colour is allowed:
  // a <meta> cannot read a CSS variable.
  themeColor: { light: '#faf7f2', dark: '#1b1814' }
} as const;

type SeoInput = {
  title?: string;
  description?: string;
  image?: string;
  // The page's own path, for the canonical link and og:url ("/pricing").
  path?: string;
  noindex?: boolean;
};

export const seo = ({ title, description, image, path, noindex }: SeoInput = {}) => {
  const fullTitle = title ? `${title}${SITE.titleSuffix}` : SITE.name;
  const text = description ?? SITE.description;
  const picture = image ?? SITE.image;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: text },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: text },
      { property: 'og:image', content: picture },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: text },
      { name: 'twitter:image', content: picture },
      ...(noindex ? [{ name: 'robots', content: 'noindex' }] : [])
    ],
    links: path ? [{ rel: 'canonical', href: path }] : []
  };
};
