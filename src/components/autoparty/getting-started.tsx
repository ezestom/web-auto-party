"use client";

import { useState } from "react";
import { Check, ListMusic, Radio, Upload } from "lucide-react";
import { steps } from "./content";

const panels = [
  { icon: Upload, label: "YOUR LOCAL LIBRARY", title: "Start with your own tracks.", items: ["Open Library", "Choose audio files from your device", "Bring at least two songs to try transitions"] },
  { icon: ListMusic, label: "YOUR PARTY PROGRAMME", title: "Give the night a direction.", items: ["Create your own music themes", "Add songs to each theme", "Optionally arrange themes into a programme"] },
  { icon: Radio, label: "PARTY MODE", title: "You are ready to play.", items: ["Open Party mode", "Press Start party", "Choose what plays next or take manual control"] },
];

export function GettingStarted() {
  const [active, setActive] = useState(0);
  const panel = panels[active];
  const Icon = panel.icon;

  return <div className="ap-guide">
    <div className="ap-guide-steps">{steps.map((step, index) => <div key={step.title} className="ap-guide-step">
      <button type="button" aria-expanded={index === active} aria-controls="getting-started-panel" onClick={() => setActive(index)}><span>0{index + 1}</span>{step.title}</button>
      {index === active && <p>{step.body}</p>}
    </div>)}</div>
    <div className="ap-guide-panel" id="getting-started-panel" role="region" aria-label={steps[active].title} aria-live="polite">
      <div className="ap-guide-bar"><span>AutoParty / getting started</span><span>0{active + 1} / 03</span></div>
      <div className="ap-guide-content"><Icon aria-hidden="true" /><p className="ap-label">{panel.label}</p><h3>{panel.title}</h3><ul>{panel.items.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
      <div className="ap-guide-progress" aria-hidden="true">{panels.map((_, index) => <span key={index} data-active={index === active} />)}</div>
    </div>
  </div>;
}
