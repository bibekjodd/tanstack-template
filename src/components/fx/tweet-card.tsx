/**
 * @kit name: TweetCard, MagicTweet, TweetSkeleton, TweetNotFound
 * @kit group: cards
 * @kit use: A card that shows a real tweet (avatar, text, photos or video) fetched from its id at runtime, with a skeleton while loading and a not-found card on error; use it for social proof walls.
 * @kit props: id (tweet id string), className, apiUrl, fallback, components, fetchOptions, onError
 * @kit example: <TweetCard id="1628832338187636740" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/tweet-card
 */
import { cn } from '@/lib/utils';
import { enrichTweet, useTweet, type EnrichedTweet, type TweetProps } from 'react-tweet';
import type { Tweet } from 'react-tweet/api';

interface TwitterIconProps {
  className?: string;
  [key: string]: unknown;
}
const Twitter = ({ className, ...props }: TwitterIconProps) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
);

const Verified = ({ className, ...props }: TwitterIconProps) => (
  <svg aria-label="Verified Account" viewBox="0 0 24 24" className={className} {...props}>
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
);

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-md motion-reduce:animate-none', className)}
      {...props}
    />
  );
};

export const TweetSkeleton = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    role="status"
    aria-label="Loading tweet"
    className={cn(
      'border-border bg-card flex size-full max-h-max min-w-72 flex-col gap-2 rounded-xl border p-4',
      className
    )}
    {...props}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const TweetNotFound = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    role="alert"
    className={cn(
      'border-border bg-card text-muted-foreground flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4',
      className
    )}
    {...props}
  >
    <h3 className="text-foreground text-sm font-medium">Tweet not found</h3>
  </div>
);

export const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="flex flex-row items-start justify-between tracking-normal">
    <div className="flex items-center space-x-3">
      <a href={tweet.user.url} target="_blank" rel="noreferrer" className="shrink-0">
        <img
          title={`Profile picture of ${tweet.user.name}`}
          alt={tweet.user.screen_name}
          height={48}
          width={48}
          src={tweet.user.profile_image_url_https}
          className="border-border/50 overflow-hidden rounded-full border"
        />
      </a>
      <div className="flex flex-col gap-0.5">
        <a
          href={tweet.user.url}
          target="_blank"
          rel="noreferrer"
          className="text-foreground flex items-center font-medium whitespace-nowrap transition-opacity hover:opacity-80"
        >
          {truncate(tweet.user.name, 20)}
          {(tweet.user.verified || tweet.user.is_blue_verified) && (
            <Verified className="text-chart-5 ml-1 inline size-4" />
          )}
        </a>
        <div className="flex items-center space-x-1">
          <a
            href={tweet.user.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            @{truncate(tweet.user.screen_name, 16)}
          </a>
        </div>
      </div>
    </div>
    <a href={tweet.url} target="_blank" rel="noreferrer">
      <span className="sr-only">Link to tweet</span>
      <Twitter className="text-muted-foreground hover:text-foreground size-5 items-start transition-all ease-in-out hover:scale-105" />
    </a>
  </div>
);

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="text-[15px] leading-relaxed tracking-normal wrap-break-word">
    {tweet.entities.map((entity, idx) => {
      switch (entity.type) {
        case 'url':
        case 'symbol':
        case 'hashtag':
        case 'mention':
          return (
            <a
              key={idx}
              href={entity.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-[15px] font-normal transition-colors"
            >
              <span>{entity.text}</span>
            </a>
          );
        case 'text':
          return (
            <span
              key={idx}
              className="text-foreground text-[15px] font-normal"
              dangerouslySetInnerHTML={{ __html: entity.text }}
            />
          );
        default:
          return null;
      }
    })}
  </div>
);

// The link-preview image of a tweet's card; the package does not type the card's bindings.
const getCardImage = (tweet: EnrichedTweet): string | undefined => {
  const card: unknown = (tweet as { card?: unknown }).card;
  if (typeof card !== 'object' || card === null) return undefined;
  const bindings = (card as { binding_values?: unknown }).binding_values;
  if (typeof bindings !== 'object' || bindings === null) return undefined;
  const thumbnail = (bindings as { thumbnail_image_large?: unknown }).thumbnail_image_large;
  if (typeof thumbnail !== 'object' || thumbnail === null) return undefined;
  const value = (thumbnail as { image_value?: unknown }).image_value;
  if (typeof value !== 'object' || value === null) return undefined;
  const url = (value as { url?: unknown }).url;
  return typeof url === 'string' ? url : undefined;
};

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
  const cardImage = getCardImage(tweet);
  if (!tweet.video && !tweet.photos && !cardImage) return null;
  return (
    <div className="flex flex-1 items-center justify-center">
      {tweet.video && (
        <video
          poster={tweet.video.poster}
          autoPlay
          loop
          muted
          playsInline
          className="border-border rounded-xl border shadow-sm"
        >
          <source src={tweet.video.variants[0]?.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {tweet.photos && (
        <div className="relative flex transform-gpu snap-x snap-mandatory gap-4 overflow-x-auto">
          <div className="shrink-0 snap-center sm:w-2" />
          {tweet.photos.map((photo) => (
            <img
              key={photo.url}
              src={photo.url}
              width={photo.width}
              height={photo.height}
              title={'Photo by ' + tweet.user.name}
              alt={tweet.text}
              className="border-border h-64 w-5/6 shrink-0 snap-center snap-always rounded-xl border object-cover shadow-sm"
            />
          ))}
          <div className="shrink-0 snap-center sm:w-2" />
        </div>
      )}
      {!tweet.video && !tweet.photos && cardImage && (
        <img
          src={cardImage}
          className="border-border h-64 rounded-xl border object-cover shadow-sm"
          alt={tweet.text}
        />
      )}
    </div>
  );
};

const withSafeEntities = <T extends { entities?: Tweet['entities'] }>(
  tweet: T
): T & { entities: Tweet['entities'] } => ({
  ...tweet,
  entities: {
    ...tweet.entities,
    hashtags: tweet.entities?.hashtags ?? [],
    urls: tweet.entities?.urls ?? [],
    symbols: tweet.entities?.symbols ?? [],
    user_mentions: tweet.entities?.user_mentions ?? []
  }
});

export const MagicTweet = ({
  tweet,
  className,
  ...props
}: {
  tweet: Tweet;
  className?: string;
}) => {
  const safeTweet: Tweet = {
    ...withSafeEntities(tweet),
    quoted_tweet: tweet.quoted_tweet ? withSafeEntities(tweet.quoted_tweet) : undefined
  };
  const enrichedTweet = enrichTweet(safeTweet);
  return (
    <div
      className={cn(
        'border-border bg-card text-card-foreground relative flex h-fit w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border p-5',
        className
      )}
      {...props}
    >
      <TweetHeader tweet={enrichedTweet} />
      <TweetBody tweet={enrichedTweet} />
      <TweetMedia tweet={enrichedTweet} />
    </div>
  );
};

/**
 * TweetCard. This is TanStack Start, so there are no server components: the tweet is fetched in
 * the browser (react-tweet's `useTweet`), with a skeleton while it loads and a "Tweet not found"
 * card when it cannot be fetched.
 */
export const TweetCard = ({
  id,
  apiUrl,
  fallback = <TweetSkeleton />,
  components,
  fetchOptions,
  onError,
  ...props
}: TweetProps & {
  className?: string;
}) => {
  const { data, error, isLoading } = useTweet(id, apiUrl, fetchOptions);

  if (isLoading) return fallback;
  if (error || !data) {
    const NotFound = components?.TweetNotFound ?? TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <MagicTweet tweet={data} {...props} />;
};
