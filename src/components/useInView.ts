"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect はサーバー側で警告を出すため、その場合は useEffect を使います。 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 要素が初めて画面に入ったことを知らせ、以降は監視を止めます。
 * IntersectionObserver が使えない環境では「表示済み」として扱うため、
 * 内容が隠れたままになることはありません。
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/**
 * 同じ仕組みを、JavaScript を無効にしている方にも配慮したかたちにしたものです。
 *
 * サーバーが返す HTML では active が true になるため、スクリプトを切っていても
 * ページはそのまま読めます。読み込まれた直後（画面が描かれる前）に監視へ
 * 切り替わり、意図したとおりの表示アニメーションが始まります。
 */
export function useEntrance<T extends HTMLElement>(threshold?: number) {
  const { ref, inView } = useInView<T>(threshold);
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setHydrated(true);
  }, []);

  return { ref, active: !hydrated || inView, hydrated };
}
