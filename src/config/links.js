// Shared configuration: placeholder links + game/studio copy.
// Rebranding text and URLs live here so a single edit updates the whole site.

// --- External links (placeholders — swap for the real URLs later) ---
// TODO: Steam store / wishlist page for Waybound.
export const STEAM_URL = "https://store.steampowered.com/";
export const DISCORD_URL = "https://discord.gg/VB3hGbUEb";
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
export const GAME_SUBTITLE = "It knew your name before you did.";
export const GAME_GENRE = "Action RPG · Roguelike";

// Atmospheric teaser copy.
export const GAME_SYNOPSIS = [
  "You wake in the woods at night with no name and no memory of arriving. There is a path. Further along it there is a dead man, and he is carrying a bow, a hood, and a book — and when you open the book, it writes your name on the first page while you watch.",
  "Past the treeline there is a village that is on no map you have ever seen. The people there talk to you as though you are expected. The gate stands open. There is one road out of it, and nothing at all is stopping you from taking it.",
  "Explore a handcrafted world with fast, readable bow combat, a leap that buys you room, and runs that reshape themselves every time you fall. Part action-RPG, part roguelike — each attempt teaches you something the last one charged you for.",
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

// --- CTA labels ---
export const CTA_WISHLIST = "Wishlist on Steam";
export const CTA_TRAILER = "Watch Trailer";
export const CTA_DEMO_BADGE = "Demo coming soon";

// --- SEO / social ---
export const SITE_URL = "https://www.epicmillennium.com";
export const SITE_TITLE = "Epic Millennium — Waybound";
export const SITE_DESCRIPTION =
  "Waybound is an action-RPG roguelike set around a village that is on no map. Take the one road out — through woods, narrows and a skeleton camp — with fast bow combat and runs that reshape each time you fall. Built in Godot by indie studio Epic Millennium. Wishlist on Steam.";

// --- The Cursed Path ---------------------------------------------------------
// The first playable arena, presented as a surveyed map. Every figure is the
// real one from the level's design doc — walked distances, not marketing
// numbers — so the map on the site and the arena in the build cannot drift.
//
// COPY RULE: this section hints, it does not explain. What the road actually
// does is the game's first real surprise and the site must not spend it.
// Deja vu, unease and things that do not quite add up are in bounds; saying
// the quiet part out loud is not.

export const BOOK_KICKER = "The book";
export const BOOK_TITLE = "It was already writing.";
export const BOOK_BODY = [
  "The dead man had a bow, a hood, and a book bound in something that was not quite leather. The bow and the hood were useful. The book was worse than useful — it was expecting you.",
  "It keeps the record: every day, every road walked, every thing killed, every name you were given by someone who had no business knowing it. And it keeps a forecast, which is the part nobody has been able to explain.",
];
// The one line that names the open question without answering it.
export const BOOK_QUESTION = "Nobody has yet established who the dead man was.";

export const PATH_TITLE = "The Cursed Path";
export const PATH_KICKER = "Arena 01";
export const PATH_INTRO =
  "Seventy-four metres of road, surveyed end to end: wooded path, boulder narrows, and a skeleton camp that has no intention of letting you through quietly. Walk it, if the road lets you.";

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
    lore: "The road ends at a gate. You are almost sure you have seen its ironwork somewhere before, and you have not been here long enough to have seen anything twice. Something is standing in it.",
    intel: ["Gate Boss · 240 HP", "Not the way out"],
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
