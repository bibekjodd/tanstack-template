/**
 * @kit name: AvatarCircles
 * @kit group: media
 * @kit use: A row of overlapping round avatars with an optional "+N" count; use it for social proof such as "joined by 99 people".
 * @kit props: avatarUrls ({ imageUrl, profileUrl, name? }[]), numPeople (count shown as +N), className
 * @kit example: <AvatarCircles numPeople={99} avatarUrls={[{ imageUrl: '/a.jpg', profileUrl: '/people/a', name: 'Ada' }]} />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/avatar-circles
 */
import { cn } from '@/lib/utils';

interface Avatar {
  imageUrl: string;
  profileUrl: string;
  /** Accessible name of the person; used as the image alt text. */
  name?: string;
}
interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Avatar[];
}

export const AvatarCircles = ({ numPeople, className, avatarUrls }: AvatarCirclesProps) => {
  return (
    <div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={`${url.profileUrl}-${index}`}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:z-10 focus-visible:ring-3"
        >
          <img
            className="border-background h-10 w-10 rounded-full border-2 object-cover"
            src={url.imageUrl}
            width={40}
            height={40}
            loading="lazy"
            alt={url.name ?? `Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <span className="border-background bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full border-2 text-center text-xs font-medium">
          +{numPeople}
        </span>
      )}
    </div>
  );
};
