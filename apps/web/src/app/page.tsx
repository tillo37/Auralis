const QUICK_PICKS = [
  { id: 1, title: 'Liked Songs' },
  { id: 2, title: 'Discover Weekly' },
  { id: 3, title: 'Release Radar' },
  { id: 4, title: 'Daily Mix 1' },
  { id: 5, title: 'Top Tracks' },
  { id: 6, title: 'New Arrivals' },
];

const MADE_FOR_YOU = [
  { id: 1, title: 'Daily Mix 1', subtitle: 'Based on your recent listening' },
  { id: 2, title: 'Daily Mix 2', subtitle: 'Curated for your taste' },
  { id: 3, title: 'Discover Weekly', subtitle: 'New music every Monday' },
  { id: 4, title: 'Release Radar', subtitle: 'Fresh releases from artists you follow' },
  { id: 5, title: 'Time Capsule', subtitle: 'Songs from your past' },
];

const RECENTLY_PLAYED = [
  { id: 1, title: 'Chill Vibes', subtitle: 'Playlist' },
  { id: 2, title: 'Workout Mix', subtitle: 'Playlist' },
  { id: 3, title: 'Late Night Jazz', subtitle: 'Playlist' },
  { id: 4, title: 'Focus Flow', subtitle: 'Playlist' },
  { id: 5, title: 'Road Trip Anthems', subtitle: 'Playlist' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  return (
    <div className="p-8 space-y-10">
      <section>
        <h1 className="text-3xl font-bold text-foreground mb-5">{getGreeting()}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_PICKS.map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-3 rounded-md bg-secondary hover:bg-accent transition-colors cursor-pointer overflow-hidden text-left"
            >
              <div className="h-16 w-16 bg-muted shrink-0" />
              <span className="font-semibold text-sm text-foreground pr-3 truncate">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Made for you</h2>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1">
          {MADE_FOR_YOU.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 shrink-0 w-44 cursor-pointer group"
            >
              <div className="h-44 w-44 rounded-md bg-muted group-hover:bg-accent transition-colors" />
              <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate leading-tight">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Recently played</h2>
        <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1">
          {RECENTLY_PLAYED.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 shrink-0 w-44 cursor-pointer group"
            >
              <div className="h-44 w-44 rounded-md bg-secondary group-hover:bg-accent transition-colors" />
              <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
