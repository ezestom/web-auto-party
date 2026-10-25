export const APP_URL = "https://freeautoparty.vercel.app/";

export const navigation = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
] as const;

export const steps = [
  { title: "Add your music", body: "Open Library and import songs from your device. Your tracks stay in your local browser library." },
  { title: "Choose your themes", body: "Group your tracks into themes. Want to plan ahead? Arrange them into a party programme." },
  { title: "Start the party", body: "Open Party mode and press Start party. AutoParty handles the transitions; you choose what plays next." },
] as const;

export const questions = [
  { question: "Do I need an account?", answer: "No account is needed for local Auto-DJ. Optional Groq planning requires a beta access code and server configuration." },
  { question: "Does AutoParty include music?", answer: "No. Bring your own music files and import them from your device. There is no built-in music catalogue or Spotify or YouTube connection." },
  { question: "Where is my library stored?", answer: "Your library is stored in this browser on this device. It does not automatically sync across devices. Clearing site data can remove your library, so keep your original files." },
  { question: "What does the AI do?", answer: "When configured, Groq suggests track order and transitions using song metadata, such as title, artist, estimated BPM and duration. Audio files are not sent in this planning flow. Playback and mixing happen in your browser. Local Auto-DJ can order tracks by estimated BPM without Groq." },
  { question: "Can I mix manually?", answer: "Yes. Use the two-deck console, crossfader, three-band EQ, filters, loops, hot cues and sampler. You can resume Auto-DJ after taking manual control. BPM is estimated; matching BPM does not guarantee precise beat alignment." },
  { question: "Can I use a TV or projector?", answer: "Yes. Import your own videos, then open Visuals to use the TV / projector window alongside the DJ preview. Allow the popup when prompted. This is a second-screen view, not an online broadcast." },
  { question: "Which files and devices can I use?", answer: "Import local audio and video files. Playback depends on the formats and codecs your browser supports. Separate headphone and booth outputs also depend on browser support and your audio hardware." },
  { question: "Can I record my mix?", answer: "Yes. Use REC to record your session, then stop and download a stereo WAV file. Keep the page open while recording." },
  { question: "Does it separate vocals or stream party rooms?", answer: "No. Stem separation and online party rooms are not available in the current version." },
] as const;

// Add only published product tutorials. The written guide remains the default.
export type Tutorial = {
  title: string;
  description: string;
  durationSeconds: number;
  poster: string;
  source: string;
  captions: string;
  transcript: string;
};
export const tutorials: Tutorial[] = [];
