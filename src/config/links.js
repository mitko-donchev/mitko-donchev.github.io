// Shared configuration: placeholder links + game/studio copy.
// Rebranding text and URLs live here so a single edit updates the whole site.

// --- External links (placeholders — swap for the real URLs later) ---
// TODO: Steam store / wishlist page for Waybound.
export const STEAM_URL = "https://store.steampowered.com/";
export const DISCORD_URL = "https://discord.com/invite/UuWXZYDgg2";
export const TWITTER_URL = "https://x.com/EpicMillennium";
export const YOUTUBE_URL = "https://www.youtube.com/@epicmillennium";
// TODO: YouTube trailer for the "Watch Trailer" CTA.
export const TRAILER_URL = "#";

// --- Studio ---
export const STUDIO_NAME = "Epic Millennium";
export const STUDIO_TAGLINE = "Built by gamers. Made for gamers.";
export const STUDIO_MISSION =
  "Epic Millennium is an independent studio building the games we always wanted to play. No publishers dictating the vision, no compromises — just games crafted by players, for players.";
export const STUDIO_TEAM_BLURB = "A small, independent team.";
// `id` keys the avatar image imported in the Studio section.
export const STUDIO_TEAM = [
  {
    id: "dimitar",
    name: "Dimitar Petrov",
    role: "Game Developer",
    github: "https://github.com/dvp-petrov",
  },
  {
    id: "mitko",
    name: "Mitko Donchev",
    role: "Game Developer",
    github: "https://github.com/mitko-donchev",
  },
];

// --- Game ---
export const GAME_NAME = "Waybound";
// The title is the book's title, and it is meant to be read three ways at
// once: bound for somewhere, bound to a way, and a bound book.
export const GAME_SUBTITLE = "Something out here is keeping count.";
export const GAME_GENRE = "Action RPG · Roguelike";

// Atmospheric teaser copy. It sells the road and the fight. It does not tell
// the story — see the COPY RULE below.
export const GAME_SYNOPSIS = [
  "There is a village, and there is one road out of it. The gate stands open and nobody is guarding it. Take the road and find out what that is worth.",
  "Fast, readable bow combat: nock, loose, and a leap that buys back the distance you just gave away. Skeletons come in pairs, the narrows give you nowhere to stand, and the thing at the far end does not flinch when you chip it.",
  "Part action-RPG, part roguelike. Runs reshape themselves every time you fall, and each attempt teaches you something the last one charged you for.",
  "Built from the ground up in Godot with GDScript by a small team making the game we always wanted to play — in the open, with the players who care about it as much as we do.",
];

// In-world verse — rendered as an excerpt lifted from an old text, with the
// surrounding lines faded at the edges. GAME_VERSE_LEAD flows into the first
// line; GAME_VERSE_TAIL trails off after the last.
export const GAME_VERSE_LEAD =
  "…and the elders, who had long since stopped counting the ways home, would sing:";
export const GAME_VERSE = [
  "Through wood and field and hollow deep,",
  "the road you walk is yours to keep —",
  "but stray as far as far can be,",
  "the village calls you home to thee.",
];
export const GAME_VERSE_TAIL =
  "And still the gate waits when the road is gone…";

// Status pills.
export const GAME_RELEASE = "TBD";
export const GAME_DEMO = "Coming soon";
export const GAME_PLATFORM = "Steam";
export const GAME_ENGINE = "Godot · GDScript";

// Shown in the tab while the visitor is looking at something else. It has to
// be atmospheric and it has to explain nothing — an invitation back, not a
// hint. Lifted from the synopsis, which is already inside the COPY RULE.
export const AWAY_TITLE = "The gate is still open.";

// --- CTA labels ---
export const CTA_WISHLIST = "Wishlist on Steam";
export const CTA_TRAILER = "Watch Trailer";
export const CTA_DEMO_BADGE = "Demo coming soon";

// --- The demo notice ---------------------------------------------------------
// Point this at a form endpoint (Buttondown, Formspree, ConvertKit, a Worker
// — anything that accepts a POST) and the notice becomes a signup form.
//
// Empty on purpose. A form that posts nowhere is worse than no form, so while
// this is blank the site points at the Discord instead, which is a channel
// that already exists and already works. Nothing here collects anything until
// you decide where it should go.
export const NOTIFY_ENDPOINT = "";

export const NOTIFY_KICKER = "The demo";
export const NOTIFY_LINE = "It is coming. Be told when it lands.";
export const NOTIFY_PLACEHOLDER = "you@example.com";
export const NOTIFY_CTA = "Tell me";
export const NOTIFY_SENDING = "Sending…";
export const NOTIFY_DONE = "Noted. You will hear from us once.";
export const NOTIFY_ERROR = "That did not go through. Try again, or find us on Discord.";
export const NOTIFY_FALLBACK = "It is coming. The Discord hears first.";
export const NOTIFY_FALLBACK_CTA = "Join the Discord";

// --- Ambience ---
export const SOUND_ON_LABEL = "Turn ambience on";
export const SOUND_OFF_LABEL = "Turn ambience off";

// --- SEO / social ---
export const SITE_URL = "https://www.epicmillennium.com";
export const SITE_TITLE = "Epic Millennium — Waybound";
export const SITE_DESCRIPTION =
  "Waybound is an action-RPG roguelike built around one road out of a village — woods, narrows and a skeleton camp — with fast bow combat, a leap that buys you room, and runs that reshape every time you fall. Made in Godot by indie studio Epic Millennium. Wishlist on Steam.";

// --- The Cursed Path ---------------------------------------------------------
// The first playable arena, drawn as a map. Every figure is the
// real one from the level's design doc — walked distances, not marketing
// numbers — so the map on the site and the arena in the build cannot drift.
//
// COPY RULE — applies to every string in this file, not just this section.
//
// The site sells the road, the fight and the craft. It does not tell the
// story. No opening scene, no how-you-got-here, no what-the-book-turns-out-
// to-be: those are the game's to spend and it only gets to spend them once.
//
// In bounds: mechanics we have actually built, real numbers from the design
// docs, atmosphere, unease, deja vu, and questions left unanswered.
// Out of bounds: anything a player would rather have found out themselves.

export const BOOK_KICKER = "The book";
export const BOOK_TITLE = "Bound in something that is not quite leather.";
export const BOOK_BODY = [
  "The game is named after it. It is a real object you will be carrying, not a menu, and it keeps a record — of the days, of the road behind you, of everything on it that stopped moving.",
  "It also keeps something that reads like a forecast. What that is for, you will find out in the order the game gives it to you.",
];
// One open question, asked and left alone.
export const BOOK_QUESTION = "Nobody has explained the handwriting.";

// The gate stands beside the synopsis and carries the name. Its label is the
// only text in the drawing, and it has to describe the place without
// describing what the place turns out to be.
export const GATE_ALT =
  `A timber village gate under a shingled roof, its doors swung open beneath a hanging ${GAME_NAME} sign, with lit windows somewhere down the road beyond`;

export const PATH_TITLE = "The Cursed Path";
export const PATH_KICKER = "Arena 01";
export const PATH_INTRO =
  "Seventy-four metres of road, end to end: wooded path, boulder narrows, and a skeleton camp that has no intention of letting you through quietly. Walk it, if the road lets you.";

export const PATH_WAYPOINTS = [
  {
    id: "gate-out",
    icon: "gate",
    name: "The Village Gate",
    distance: "0 m",
    lore: "Where the run begins. The gate stands open, and nobody is watching it — which is the first thing here that should bother you.",
    intel: ["Spawn point", "Open ground"],
  },
  {
    id: "wood",
    icon: "wood",
    name: "The Wooded Path",
    distance: "≈ 18 m",
    lore: "Skeletons wait among the trees. Wake one within seven metres of another and both of them come.",
    intel: ["Shout radius 7 m", "Fighting pairs"],
  },
  {
    id: "narrows",
    icon: "narrows",
    name: "The Narrows",
    distance: "≈ 34 m",
    lore: "Boulders squeeze the road down to fourteen metres. No room to kite, and nowhere the arrow can miss.",
    intel: ["14 m across", "No retreat line"],
  },
  {
    id: "camp",
    icon: "camp",
    name: "The Skeleton Camp",
    distance: "56 m",
    lore: "A garrison and its elite. Two chests stand behind them, and a chest takes three uninterrupted seconds — which the camp will not give you.",
    intel: ["Camp Elite · 90 HP", "2 chests, 3 s each"],
  },
  {
    id: "gate-far",
    icon: "gate",
    name: "The Far Gate",
    distance: "74 m",
    lore: "The road ends at a gate. You are almost sure you have seen its ironwork somewhere before. Something is standing in it.",
    intel: ["Gate Boss · 240 HP", "End of the road"],
  },
];

// Shown under the map. The last one is a question on purpose — it is the only
// place the section admits there is something to wonder about.
export const PATH_FACTS = [
  { value: "74", label: "metres end to end" },
  { value: "12", label: "things that want you dead" },
  { value: "3", label: "chests worth the risk" },
  { value: "?", label: "ways out" },
];

// The traveller's route home is never drawn. It walks out of sight past the
// far gate and is simply back at the start a moment later, and the map offers
// no explanation for that.
export const PATH_RETURN_LABEL = "";

// --- What walks it -----------------------------------------------------------
// True silhouette heights, measured from the meshes rather than estimated, so
// the scale strip on the site is the scale in the build.
export const BESTIARY_INTRO =
  "Three tiers of the same dead thing, and they are told apart by silhouette before they are told apart by health bar.";

export const BESTIARY = [
  {
    id: "hero",
    name: "The Ranger",
    kind: "You",
    height: 1.8,
    stat: "Bow · Disengage",
    note: "An elf with a bow, a short leap, and a poor sense of when to turn back.",
    friendly: true,
  },
  {
    id: "minion",
    name: "Skeleton",
    kind: "Minion",
    height: 2.17,
    stat: "30 HP · 15 dmg",
    note: "Comes alone, or comes in a pair. Never comes politely.",
  },
  {
    id: "elite",
    name: "Warrior",
    kind: "Elite",
    height: 2.96,
    stat: "90 HP · 23 dmg",
    note: "A scaled-up minion that hits like the tier above it.",
  },
  {
    id: "boss",
    name: "Golem",
    kind: "Boss",
    height: 4.23,
    stat: "240 HP · 30 dmg",
    note: "Chip damage never staggers it. It commits its swing, and it closes under fire.",
  },
];
