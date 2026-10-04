/**
 * @kit name: Android
 * @kit group: devices
 * @kit use: An Android phone mockup in an SVG frame that shows an image or a looping video on its screen; use it to present a mobile app or a mobile page.
 * @kit props: width (433), height (882), src (screenshot image URL), videoSrc (looping muted video URL), plus SVG props
 * @kit example: <Android src="/screens/home.png" className="w-60" />
 * @kit from: Magic UI (MIT) https://magicui.design/docs/components/android
 */
import { useId, type SVGProps } from 'react';

export interface AndroidProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
}

export function Android({ width = 433, height = 882, src, videoSrc, ...props }: AndroidProps) {
  const clipId = `android-screen-${useId().replace(/\W/g, '')}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M376 153H378C379.105 153 380 153.895 380 155V249C380 250.105 379.105 251 378 251H376V153Z"
        className="fill-scrim"
      />
      <path
        d="M376 301H378C379.105 301 380 301.895 380 303V351C380 352.105 379.105 353 378 353H376V301Z"
        className="fill-scrim"
      />
      <path
        d="M0 42C0 18.8041 18.804 0 42 0H336C359.196 0 378 18.804 378 42V788C378 811.196 359.196 830 336 830H42C18.804 830 0 811.196 0 788V42Z"
        className="fill-scrim"
      />
      <path
        d="M2 43C2 22.0132 19.0132 5 40 5H338C358.987 5 376 22.0132 376 43V787C376 807.987 358.987 825 338 825H40C19.0132 825 2 807.987 2 787V43Z"
        className="fill-on-scrim/10"
      />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M9.25 48C9.25 29.3604 24.3604 14.25 43 14.25H335C353.64 14.25 368.75 29.3604 368.75 48V780C368.75 798.64 353.64 813.75 335 813.75H43C24.3604 813.75 9.25 798.64 9.25 780V48Z"
          className="fill-muted stroke-muted stroke-[0.5]"
        />
      </g>
      <circle cx="189" cy="28" r="9" className="fill-scrim" />
      <circle cx="189" cy="28" r="4" className="fill-on-scrim/20" />
      {src && (
        <image
          href={src}
          width="360"
          height="800"
          className="size-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      )}
      {videoSrc && (
        <foreignObject
          width="380"
          height="820"
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        >
          <video
            className="size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </foreignObject>
      )}
      <defs>
        <clipPath id={clipId}>
          <rect width="360" height="800" rx="33" ry="25" transform="translate(9 14)" />
        </clipPath>
      </defs>
    </svg>
  );
}
