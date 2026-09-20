# Banner media

The banner on the landing page looks for these files:

| File | Purpose |
| --- | --- |
| `banner.mp4` | The banner video. **Required** for the video to play. |
| `banner.webm` | Optional. Served first where the browser supports it. |
| `banner-poster.jpg` | Optional. The first frame, shown while the video loads. |

Until `banner.mp4` is added, the banner falls back to a designed still, so the
page never looks broken. Drop the files in here and reload — no code changes are
needed. The paths are configurable in `src/data/site.ts`.

The page checks on the server which of these files actually exist, so nothing is
requested that is not there. In `npm run dev` a new file is picked up on the next
reload; for a production deployment, add the file and run `npm run build` again.

A few things worth knowing:

- The video is rendered in black and white (`filter: grayscale(1)`), so colour
  in the source file is not important. Contrast and movement are.
- It plays muted, looped, and inline, which is what browsers require in order to
  autoplay. Visitors can pause it or turn the sound on from the controls in the
  bottom-right corner.
- Aim for roughly 6–12 seconds, 1920×1080, H.264, and under about 6 MB. Anything
  heavier will slow the first paint noticeably.
- Visitors who have asked for reduced motion see the poster frame instead, paused.
