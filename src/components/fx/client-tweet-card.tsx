/**
 * @kit name: ClientTweetCard
 * @kit group: cards
 * @kit use: A tweet card fetched in the browser from a tweet id, with a skeleton while loading and a not-found card on error; same output as TweetCard.
 * @kit props: id (tweet id string), className, apiUrl, fallback, components, fetchOptions, onError
 * @kit example: <ClientTweetCard id="1628832338187636740" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/client-tweet-card
 */
import { MagicTweet, TweetNotFound, TweetSkeleton } from '@/components/fx/tweet-card';
import { useTweet, type TweetProps } from 'react-tweet';

export const ClientTweetCard = ({
  id,
  apiUrl,
  fallback = <TweetSkeleton />,
  components,
  fetchOptions,
  onError,
  ...props
}: TweetProps & { className?: string }) => {
  const { data, error, isLoading } = useTweet(id, apiUrl, fetchOptions);

  if (isLoading) return fallback;
  if (error || !data) {
    const NotFound = components?.TweetNotFound ?? TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <MagicTweet tweet={data} {...props} />;
};
