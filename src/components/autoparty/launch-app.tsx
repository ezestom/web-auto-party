"use client";

import { useLanguage } from "./language";
import { ArrowUpRight } from "lucide-react";
import FlyingButton from "./FlyingButton";
import { APP_URL } from "./content";

export function LaunchApp() {
  const { t } = useLanguage();
  return (
    <div className="ap-launch-slot">
      <FlyingButton
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
      </FlyingButton>
      <noscript><a href={APP_URL} className="ap-button">{t("Open AutoParty ↗")}</a></noscript>
    </div>
  );
}
