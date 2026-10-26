"use client";

import { useLanguage } from "./language";
import { ArrowUpRight } from "lucide-react";
import FlyingButton from "./FlyingButton";
import { APP_URL } from "./content";
import { useSyncExternalStore } from "react";

const flyingQuery = "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(flyingQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(flyingQuery).matches;
const serverSnapshot = () => false;

export function LaunchApp() {
  const { t } = useLanguage();
  const flying = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return (
    <div className="ap-launch-slot">
      {flying ? <FlyingButton
        className="ap-launch-button"
        theme="dark"
        size="medium"
        altitude={170}
        hoverTime={2.4}
        jets={2}
        thrusters
        trigger="hover"
        carryCursor
        smoke={1}
        turbulence={1}
        wobble={1}
        ramp={false}
        thrustColor="#8ec5ff"
        smokeColor="#eef1f6"
        onClick={() => window.location.assign(APP_URL)}
      >{t("Open AutoParty")}<ArrowUpRight aria-hidden="true" />
      </FlyingButton> : <a href={APP_URL} className="ap-button ap-launch-normal">{t("Open AutoParty")}<ArrowUpRight aria-hidden="true" /></a>}
    </div>
  );
}
