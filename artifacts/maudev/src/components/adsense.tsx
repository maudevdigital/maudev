import { useEffect, useRef } from "react";

declare global {
  interface Window { adsbygoogle: any[]; }
}

const CLIENT_ID = "ca-pub-9062385247942411";
const AUTO_SLOT = "4202340208";

/** Wait until adsbygoogle.js has loaded (polls every 200ms, max 15s) */
function waitForAdsense(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.adsbygoogle !== "undefined" && window.adsbygoogle.loaded) {
      resolve(true);
      return;
    }
    let elapsed = 0;
    const iv = setInterval(() => {
      elapsed += 200;
      if (document.querySelector('script[src*="adsbygoogle"]') && typeof window.adsbygoogle !== "undefined") {
        clearInterval(iv);
        resolve(true);
        return;
      }
      if (elapsed >= 15000) {
        clearInterval(iv);
        resolve(false);
      }
    }, 200);
  });
}

function usePushAd(containerRef: React.RefObject<HTMLDivElement | null>) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    let cancelled = false;

    waitForAdsense().then((ready) => {
      if (cancelled || pushed.current || !ready) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // ad blocker or script error
      }
    });

    const timer = setTimeout(() => {
      const ins = containerRef.current?.querySelector("ins");
      if (ins && ins.getAttribute("data-ad-status") === "unfilled") {
        containerRef.current!.style.display = "none";
      }
    }, 10000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);
}

export function AdSlot({ slotId }: { slotId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  usePushAd(containerRef);

  return (
    <div ref={containerRef} className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSlotAuto() {
  const containerRef = useRef<HTMLDivElement>(null);
  usePushAd(containerRef);

  return (
    <div ref={containerRef} className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={CLIENT_ID}
        data-ad-slot={AUTO_SLOT}
      />
    </div>
  );
}
