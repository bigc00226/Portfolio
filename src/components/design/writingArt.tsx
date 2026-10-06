import type { ReactNode } from "react";

import type { ConceptIcon } from "@/data/design";

import { HEART_BOX, HEART_PATH } from "./handwriting";

/**
 * 本文に添える絵。ペンを持った手と、大きな字を書き終えたところに出る小さな絵です。
 * どれも飾りなので、読み上げの対象からは外しています。
 */

/** 線と塗りの色。手は、白い手袋を黒い線で描いた、まんが風の絵です。 */
const LINE = "#0b0b0b";
const GLOVE = "#ffffff";

/**
 * ペンを持った手。枠は 92 × 116 で、ペン先の先端は HAND_TIP の位置にあります。
 * 手を置く位置と、回す中心は、この先端に合わせます（Writing.module.css の .hand）。
 */
export const HAND_TIP = { x: 9.9, y: 106.2, width: 92, height: 116 } as const;

export function Hand() {
  return (
    <svg
      viewBox="0 0 92 116"
      fill={GLOVE}
      stroke={LINE}
      strokeWidth="4.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* 手の甲 */}
      <path d="M 44 30 C 56 24 72 28 79 38 C 91 43 94 62 88 76 C 83 89 68 94 56 90 C 46 92 38 88 36 80 C 34 70 36 44 44 30 Z" />
      {/* 人さし指。ペンの向こう側に回っています。 */}
      <path d="M 44 30 C 36 22 22 30 16 44 C 11 55 9 68 16 72 C 22 75 27 68 28 60 C 30 50 40 40 44 30 Z" />
      {/* ペンの軸と、ペン先 */}
      <path d="M 15.8 77.8 L 56 5 Q 61.5 0.5 64 9 L 29.2 84.6 Z" />
      <path d="M 16.5 79.5 L 10 85 L 9.9 106.2 L 26.9 93.5 L 28 85 Z" />
      <path d="M 9.9 106.2 L 17.4 92" fill="none" strokeWidth="3" />
      <circle cx="18.4" cy="90" r="1.9" fill={LINE} stroke="none" />
      {/* 握った指 */}
      <path d="M 40 64 C 32 66 30 78 37 83 C 43 86 49 82 48 74" strokeWidth="3.6" />
      <path d="M 49 68 C 43 72 44 84 51 87 C 57 89 62 85 61 78" strokeWidth="3.6" />
      <path d="M 60 72 C 56 76 57 86 63 88 C 68 89 72 86 72 80" strokeWidth="3.6" />
      {/* 親指 */}
      <path d="M 68 46 C 57 41 38 41 30 48 C 22 55 25 66 35 68 C 46 70 60 68 68 62" />
      <path d="M 80 52 C 84 60 83 70 78 78" fill="none" strokeWidth="3.6" />
    </svg>
  );
}

/** 歯車の外形。中心 (24, 24) のまわりに、歯を八つ並べた形です。 */
const GEAR =
  "M 20.6 9.8 L 21.3 3.6 L 26.7 3.6 L 27.4 9.8 L 31.6 11.6 L 36.5 7.6 L 40.4 11.5 L 36.4 16.4 " +
  "L 38.2 20.6 L 44.4 21.3 L 44.4 26.7 L 38.2 27.4 L 36.4 31.6 L 40.4 36.5 L 36.5 40.4 L 31.6 36.4 " +
  "L 27.4 38.2 L 26.7 44.4 L 21.3 44.4 L 20.6 38.2 L 16.4 36.4 L 11.5 40.4 L 7.6 36.5 L 11.6 31.6 " +
  "L 9.8 27.4 L 3.6 26.7 L 3.6 21.3 L 9.8 20.6 L 11.6 16.4 L 7.6 11.5 L 11.5 7.6 L 16.4 11.6 Z";

const ICONS: Record<ConceptIcon, { viewBox?: string; art: ReactNode }> = {
  megaphone: {
    art: (
      <>
        <path d="M 13 31 V 38 A 5 5 0 0 0 23 38 V 33.5" fill="none" stroke="#3d93df" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M 3 20 Q 3 18 5 17.2 L 38 5 V 43 L 5 30.8 Q 3 30 3 28 Z" fill="#3d93df" />
        <ellipse cx="39" cy="24" rx="5.6" ry="19" fill="#0f5ea6" />
      </>
    ),
  },
  heart: {
    viewBox: HEART_BOX,
    art: <path d={HEART_PATH} fill="#e8384f" />,
  },
  gear: {
    art: (
      <>
        <path d={GEAR} fill="#3d93df" stroke="#3d93df" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="6.6" fill="#f7f7f6" stroke="#0f5ea6" strokeWidth="2.8" />
      </>
    ),
  },
  palette: {
    art: (
      <>
        <path
          d="M 24 5 C 12 5 3 13.4 3 24 C 3 34.6 11.6 43 22 43 C 26.4 43 27.4 39.6 25.8 37 C 24.2 34.4 25.6 31.4 29.2 31.4 H 35 C 40.6 31.4 45 27.6 45 21.6 C 45 12.4 35.6 5 24 5 Z"
          fill="#f08a2b"
        />
        <circle cx="13.4" cy="22" r="3.5" fill="#ffffff" />
        <circle cx="20.4" cy="13.6" r="3.5" fill="#3d93df" />
        <circle cx="30.6" cy="13.4" r="3.5" fill="#e8384f" />
        <circle cx="37.4" cy="21.4" r="3.5" fill="#37b24d" />
      </>
    ),
  },
  bulb: {
    art: (
      <>
        <path
          d="M 24 4 C 15.4 4 9.5 10.4 9.5 18.2 C 9.5 23.4 12.2 27 15.4 30 C 17 31.5 17.8 33 17.8 34.8 H 30.2 C 30.2 33 31 31.5 32.6 30 C 35.8 27 38.5 23.4 38.5 18.2 C 38.5 10.4 32.6 4 24 4 Z"
          fill="#f7c948"
        />
        <path d="M 20 22 L 24 27 L 28 22" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="17.8" y="36.6" width="12.4" height="3.4" rx="1.7" fill="#8d949c" />
        <rect x="19.6" y="41.2" width="8.8" height="3.4" rx="1.7" fill="#8d949c" />
      </>
    ),
  },
  sprout: {
    art: (
      <>
        <path d="M 24 45 V 24" fill="none" stroke="#2f9e44" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M 24 27 C 24 16 15.6 8.4 4 8.6 C 4 20.4 12.6 28 24 27 Z" fill="#37b24d" />
        <path d="M 24 22.6 C 24 13.8 31.4 6.6 43.6 7.4 C 43.6 18.4 35 24.6 24 22.6 Z" fill="#74d680" />
      </>
    ),
  },
  question: {
    art: (
      <>
        <path
          d="M 9 6 H 39 A 6 6 0 0 1 45 12 V 29 A 6 6 0 0 1 39 35 H 24 L 14 44 V 35 H 9 A 6 6 0 0 1 3 29 V 12 A 6 6 0 0 1 9 6 Z"
          fill="#3d93df"
        />
        <path d="M 19.4 16.6 C 19.4 13.4 21.6 11.6 24.3 11.6 C 27.2 11.6 29.2 13.5 29.2 16 C 29.2 19.6 24.4 19.8 24.4 23.8" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="24.4" cy="28.8" r="2" fill="#ffffff" />
      </>
    ),
  },
  code: {
    art: (
      <>
        <rect x="4" y="7" width="40" height="29" rx="5.5" fill="#37b24d" />
        <path d="M 18.6 15.5 L 12.6 21.5 L 18.6 27.5 M 29.4 15.5 L 35.4 21.5 L 29.4 27.5" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="13" y="39.6" width="22" height="4" rx="2" fill="#2b8a3e" />
      </>
    ),
  },
  bubble: {
    art: (
      <>
        <path
          d="M 9 6 H 39 A 6 6 0 0 1 45 12 V 29 A 6 6 0 0 1 39 35 H 24 L 14 44 V 35 H 9 A 6 6 0 0 1 3 29 V 12 A 6 6 0 0 1 9 6 Z"
          fill="#f08a2b"
        />
        <circle cx="15" cy="20.5" r="2.8" fill="#ffffff" />
        <circle cx="24" cy="20.5" r="2.8" fill="#ffffff" />
        <circle cx="33" cy="20.5" r="2.8" fill="#ffffff" />
      </>
    ),
  },
};

export function Icon({ name }: { name: ConceptIcon }) {
  const { viewBox = "0 0 48 48", art } = ICONS[name];
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}

/** 最後に流れる大きな文字の中の、ハート。 */
export function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={HEART_BOX} aria-hidden="true" focusable="false">
      <path d={HEART_PATH} />
    </svg>
  );
}
