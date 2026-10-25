"use client";

import { useLanguage, LanguageProvider } from "./language";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Disc3, ListMusic, MonitorPlay, Plus, Radio, SlidersHorizontal, WandSparkles } from "lucide-react";
import { navigation, questions, tutorials } from "./content";
import { HeroHyperspeed } from "./hero-hyperspeed";
import { GettingStarted } from "./getting-started";
import { ClosingBackdrop } from "./closing-backdrop";
import { WelcomeNavigation } from "./navigation";
import { LaunchApp } from "./launch-app";


function HeroConsole() {
  const { t } = useLanguage();
  const preview = <Image src="/autoparty-console.jpg" alt={t("AutoParty two-deck console with orange Deck A, a central mixer and cyan Deck B. No tracks are loaded.")} width={1440} height={900} priority sizes="(max-width: 768px) 95vw, 1088px" className="ap-reveal-image" />;
  return <figure className="ap-hero-console">
    <div className="ap-hero-showcase"><div className="ap-hero-image">{preview}
      <div className="ap-showcase-shade" />
      </div>
      <div className="ap-showcase-facts">
        <div><p>{t("Your music")}</p><strong>{t("Your files.")}<br />{t("Your party.")}</strong><span>{t("LOCAL BROWSER LIBRARY")}</span></div>
        <div><p>{t("Your way to play")}</p><strong>{t("Auto-DJ.")}<br />{t("Or take the decks.")}</strong><span>{t("ONE APP · TWO WAYS TO PLAY")}</span></div>
      </div>
    </div>
    <figcaption>{t("Actual app interface · Visual preview · Bring your own tracks")}</figcaption>
  </figure>;
}

function ConsolePreview() {
  const { t } = useLanguage();
  return (
    <figure className="ap-console ap-library-console">
      <div className="ap-console-stage">
      <div className="ap-console-frame">
        <div className="ap-window-bar"><span><i /><i /><i /></span><span>{t("AutoParty / media library")}</span><span>{t("APP PREVIEW")}</span></div>
        <Image src="/autoparty-media-library.png" alt={t("AutoParty with Media Library open: import files, create themes, search local music, load tracks to Deck A or B, and manage the video library.")} width={1919} height={911} sizes="(max-width: 768px) 95vw, 960px" />
      </div>
      </div>
      <figcaption>{t("Media Library open · User-imported music · Static app preview")}</figcaption>
    </figure>
  );
}

function WelcomeContent() {
  const { t } = useLanguage();
  return (
    <div className="ap-welcome" id="top">
      <a className="ap-skip" href="#main-content">{t("Skip to content")}</a>
      <WelcomeNavigation />
      <main id="main-content" tabIndex={-1}>
        <section className="ap-hero ap-container" aria-labelledby="hero-title">
          <HeroHyperspeed />
          <h1 id="hero-title">{t("Your music.")}<br /><span>{t("Automatically mixed.")}</span></h1>
          <p className="ap-hero-copy">{t("Bring your own tracks, organize your party into themes, and let AutoParty handle the transitions. Take control with the two-deck mixer whenever you want.")}</p>
          <div className="ap-actions"><LaunchApp /><a className="ap-button ap-button-outline" href="#how-it-works">{t("See how it works")}<ArrowDown aria-hidden="true" /></a></div>
          <ul className="ap-hero-notes" aria-label={t("Getting started")}><li>{t("Runs in your browser")}</li><li>{t("Bring your own music")}</li><li>{t("No account needed for local Auto-DJ")}</li></ul>
          <HeroConsole />
        </section>

        <nav className="ap-feature-strip ap-container" aria-label={t("Explore AutoParty")}>
          {[{icon: ListMusic, label: "Your own library", href: "#how-it-works"}, {icon: Radio, label: "Automatic transitions", href: "#features"}, {icon: SlidersHorizontal, label: "Two-deck mixing", href: "#console-preview"}, {icon: MonitorPlay, label: "Second-screen visuals", href: "#console-preview"}].map(({icon: Icon, label, href}) => <a key={label} href={href}><Icon aria-hidden="true" /><span>{t(label)}</span><ArrowUpRight aria-hidden="true" /></a>)}
        </nav>

        <section className="ap-section ap-container" id="how-it-works" aria-labelledby="how-title">
          <div className="ap-section-heading"><div><p className="ap-eyebrow">{t("01 / FROM FILES TO A PARTY")}</p><h2 id="how-title">{t("A few tracks.")}<br />{t("A whole night ahead.")}</h2></div><p>{t("Your first mix starts with music you already have. Here is how to get it playing.")}</p></div>
          <GettingStarted />
          <p className="ap-tip"><Disc3 aria-hidden="true" />{t("Bring at least two songs to try automatic transitions.")}</p>
        </section>

        <section className="ap-section ap-container" id="features" aria-labelledby="features-title">
          <div className="ap-section-heading"><div><p className="ap-eyebrow">{t("02 / YOUR KIND OF DJ")}</p><h2 id="features-title">{t("Let it flow.")}<br />{t("Or make it your own.")}</h2></div><p>{t("One app, two ways to play. Leave the transitions to AutoParty or step behind the decks.")}</p></div>
          <div className="ap-modes">
            <article className="ap-mode ap-mode-auto"><Radio aria-hidden="true" /><span className="ap-label">{t("PARTY MODE")}</span><h3>{t("Be at your own party.")}</h3><p>{t("Start local Auto-DJ, manage the queue, and move between your music themes. It orders tracks by estimated BPM and handles automatic transitions.")}</p><a href="#party-programme">{t("Plan the night")}<ArrowRight aria-hidden="true" /></a></article>
            <article className="ap-mode ap-mode-manual"><SlidersHorizontal aria-hidden="true" /><span className="ap-label">{t("MANUAL CONSOLE")}</span><h3>{t("The decks are yours.")}</h3><p>{t("Two decks, a crossfader, three-band EQ, filters, loops, hot cues and a sampler. Take control of the mix, then resume Auto-DJ when you are ready.")}</p><a href="#console-preview">{t("Explore the console")}<ArrowRight aria-hidden="true" /></a></article>
          </div>
        </section>

        <section className="ap-section ap-container ap-programme" id="party-programme" aria-labelledby="programme-title">
          <div><p className="ap-eyebrow">{t("03 / SET THE NIGHT IN MOTION")}</p><h2 id="programme-title">{t("Every part of your party.")}<br />{t("Its own sound.")}</h2><p className="ap-body">{t("Create your own themes and arrange them into a party programme. Set approximate durations, let songs finish naturally, and switch themes when you are ready.")}</p><p className="ap-small">{t("Changes follow song endings. The last theme keeps playing.")}</p></div>
          <div className="ap-timeline"><p className="ap-label">{t("AN EXAMPLE OF YOUR OWN THEMES")}</p>{["Warm-up", "Dance floor", "Late night"].map((theme, index) => <div className="ap-timeline-row" key={theme}><span className="ap-timeline-dot" /><span className="ap-timeline-number">{"0"}{index + 1}</span><strong>{t(theme)}</strong><AudioLines aria-hidden="true" /></div>)}<p className="ap-small">{t("Your themes. Your tracks. Your order.")}</p></div>
        </section>

        <section className="ap-section ap-container" id="console-preview" aria-labelledby="console-title"><div className="ap-section-heading"><div><p className="ap-eyebrow">{t("04 / A CLOSER LOOK")}</p><h2 id="console-title">{t("Meet your library.")}</h2></div><p>{t("Import your music, create themes, search your tracks and choose what to load next.")}</p></div><ConsolePreview /><div className="ap-extra-features">
          <article><ListMusic aria-hidden="true" /><h3>{t("Shape the next song")}</h3><p>{t("Add tracks from your library to the queue and choose what plays next.")}</p></article>
          <article><MonitorPlay aria-hidden="true" /><h3>{t("Go beyond the speakers")}</h3><p>{t("Import videos and open the TV / projector window, with a preview for the DJ. Allow the popup to use a second screen.")}</p></article>
          <article><Disc3 aria-hidden="true" /><h3>{t("Keep the mix")}</h3><p>{t("Record your session with REC, then stop and download a stereo WAV file.")}</p></article>
        </div></section>

        <aside className="ap-container ap-ai-note" aria-labelledby="ai-title"><WandSparkles aria-hidden="true" /><div><h2 id="ai-title">{t("A little extra planning. When you want it.")}</h2><p>{t("Optional Groq planning can suggest track order and transitions when the server is configured and you have a beta access code. Local Auto-DJ works without it.")}</p><p className="ap-small">{t("Your audio is processed in your browser. Optional remote planning uses song metadata.")}</p></div><span className="ap-beta">{t("OPTIONAL AI")}</span></aside>

        {tutorials.length > 0 && <section className="ap-section ap-container" aria-labelledby="tutorials-title"><p className="ap-eyebrow">{t("LEARN AT YOUR OWN PACE")}</p><h2 id="tutorials-title">{t("See it in action.")}</h2><div className="ap-tutorials">{tutorials.map((tutorial) => <article key={tutorial.source}><h3>{tutorial.title}</h3><p>{tutorial.description}</p><p className="ap-small">{Math.floor(tutorial.durationSeconds / 60)}{":"}{String(tutorial.durationSeconds % 60).padStart(2, "0")}</p><video controls preload="none" poster={tutorial.poster}><source src={tutorial.source} /><track kind="captions" src={tutorial.captions} srcLang="en" label="English" default /></video><a href={tutorial.transcript}>{t("Read transcript")}</a></article>)}</div></section>}

        <section className="ap-section ap-container ap-faq" id="faq" aria-labelledby="faq-title"><div><p className="ap-eyebrow">{t("05 / GOOD TO KNOW")}</p><h2 id="faq-title">{t("Before you")}<br />{t("press play.")}</h2><p className="ap-body">{t("A few answers for your first night with AutoParty.")}</p></div><div className="ap-questions">{questions.map((item) => <details key={t(item.question)}><summary>{t(item.question)}<Plus aria-hidden="true" /></summary><p>{t(item.answer)}</p></details>)}</div></section>

      </main>
      <div className="ap-closing">
      <ClosingBackdrop />
      <section className="ap-section ap-container ap-final" aria-labelledby="final-title"><p className="ap-eyebrow">{t("YOUR MUSIC. PARTY ON.")}</p><h2 id="final-title">{t("Your next party starts")}<br />{t("with your own music.")}</h2><p>{t("Open your library. Set the mood. Enjoy the night.")}</p><div className="ap-actions"><LaunchApp /><a href="#how-it-works" className="ap-button ap-button-outline">{t("See how it works")}<ArrowRight aria-hidden="true" /></a></div></section>
      <footer className="ap-container ap-footer"><nav aria-label={t("Footer navigation")}>{navigation.map(item => <a href={item.href} key={item.href}>{t(item.label)}</a>)}<a href="#top">{t("Back to top ↑")}</a></nav><p className="ap-small ap-footer-credit"><span>{t("AutoParty · Browser-based mixing · Beta")}</span><span aria-hidden="true">{"·"}</span><a className="ap-developer-credit" href="https://ezestom.is-a.dev/" target="_blank" rel="noopener noreferrer" aria-label={t("Developing by e — visit website (opens in a new tab)")}><span>{t("Developing by")}</span><Image src="/e-developer-logo.webp" alt={"e"} width={32} height={32} /></a></p></footer>
      </div>
    </div>
  );
}




export function AutoPartyWelcome() {
  return <LanguageProvider><WelcomeContent /></LanguageProvider>;
}

