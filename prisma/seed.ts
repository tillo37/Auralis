import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ARTISTS = [
  { name: 'Radiohead', bio: 'Alternative rock band from Abingdon, England.' },
  { name: 'Kendrick Lamar', bio: 'Rapper and songwriter from Compton, California.' },
  { name: 'Björk', bio: 'Avant-garde artist from Reykjavík, Iceland.' },
  { name: 'Daft Punk', bio: 'Electronic music duo from Paris, France.' },
  { name: 'Miles Davis', bio: 'Jazz trumpeter and composer from Alton, Illinois.' },
  { name: 'Portishead', bio: 'Trip-hop band from Bristol, England.' },
  { name: 'Frank Ocean', bio: 'R&B singer-songwriter from Long Beach, California.' },
  { name: 'Aphex Twin', bio: 'Electronic musician Richard D. James from Cornwall, England.' },
  { name: 'Nina Simone', bio: 'Jazz and soul singer-songwriter from Tryon, North Carolina.' },
  { name: 'LCD Soundsystem', bio: 'Dance-punk band led by James Murphy from New York.' },
];

const ALBUMS: Array<{
  title: string;
  artist: string;
  releaseYear: number;
  trackTitles: string[];
}> = [
  {
    title: 'OK Computer',
    artist: 'Radiohead',
    releaseYear: 1997,
    trackTitles: ['Airbag', 'Paranoid Android', 'Subterranean Homesick Alien', 'Exit Music (For a Film)', 'Let Down'],
  },
  {
    title: 'Kid A',
    artist: 'Radiohead',
    releaseYear: 2000,
    trackTitles: ['Everything in Its Right Place', 'Kid A', 'The National Anthem', 'How to Disappear Completely', 'Treefingers'],
  },
  {
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    releaseYear: 2015,
    trackTitles: ["Wesley's Theory", 'For Free?', 'King Kunta', 'Institutionalized', 'These Walls'],
  },
  {
    title: 'DAMN.',
    artist: 'Kendrick Lamar',
    releaseYear: 2017,
    trackTitles: ['BLOOD.', 'DNA.', 'YAH.', 'ELEMENT.', 'FEEL.'],
  },
  {
    title: 'Homogenic',
    artist: 'Björk',
    releaseYear: 1997,
    trackTitles: ['Hunter', 'Jóga', 'Unravel', 'Bachelorette', 'All Neon Like'],
  },
  {
    title: 'Vespertine',
    artist: 'Björk',
    releaseYear: 2001,
    trackTitles: ['Hidden Place', 'Cocoon', "It's Not Up to You", 'Undo', 'Pagan Poetry'],
  },
  {
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    releaseYear: 2013,
    trackTitles: ['Give Life Back to Music', 'The Game of Love', 'Giorgio by Moroder', 'Within', 'Instant Crush'],
  },
  {
    title: 'Discovery',
    artist: 'Daft Punk',
    releaseYear: 2001,
    trackTitles: ['One More Time', 'Aerodynamic', 'Digital Love', 'Harder Better Faster Stronger', 'Crescendolls'],
  },
  {
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    releaseYear: 1959,
    trackTitles: ['So What', 'Freddie Freeloader', 'Blue in Green', 'All Blues', 'Flamenco Sketches'],
  },
  {
    title: 'Bitches Brew',
    artist: 'Miles Davis',
    releaseYear: 1970,
    trackTitles: ["Pharaoh's Dance", 'Bitches Brew', 'Spanish Key', 'John McLaughlin', 'Miles Runs the Voodoo Down'],
  },
  {
    title: 'Dummy',
    artist: 'Portishead',
    releaseYear: 1994,
    trackTitles: ['Mysterons', 'Sour Times', 'Strangers', 'It Could Be Sweet', 'Wandering Star'],
  },
  {
    title: 'Portishead',
    artist: 'Portishead',
    releaseYear: 1997,
    trackTitles: ['Cowboys', 'All Mine', 'Undenied', 'Half Day Closing', 'Over'],
  },
  {
    title: 'Blonde',
    artist: 'Frank Ocean',
    releaseYear: 2016,
    trackTitles: ['Nikes', 'Ivy', 'Pink + White', 'Be Yourself', 'Solo'],
  },
  {
    title: 'Channel Orange',
    artist: 'Frank Ocean',
    releaseYear: 2012,
    trackTitles: ['Start', 'Thinkin Bout You', 'Fertilizer', 'Sierra Leone', 'Sweet Life'],
  },
  {
    title: 'Selected Ambient Works Volume II',
    artist: 'Aphex Twin',
    releaseYear: 1994,
    trackTitles: ['Cliffs', 'Stone in Focus', 'Blue Calx', 'Radiator', 'Rhubarb'],
  },
  {
    title: 'Richard D. James Album',
    artist: 'Aphex Twin',
    releaseYear: 1996,
    trackTitles: ['4', 'Cornish Acid', 'Peek 824545201', 'Fingerbib', 'Carn Marth'],
  },
  {
    title: 'I Put a Spell on You',
    artist: 'Nina Simone',
    releaseYear: 1965,
    trackTitles: ['I Put a Spell on You', 'Tomorrow Is My Turn', 'Ne Me Quitte Pas', 'The Other Woman', 'Feeling Good'],
  },
  {
    title: 'Pastel Blues',
    artist: 'Nina Simone',
    releaseYear: 1965,
    trackTitles: ["Be My Husband", "Nobody Knows You When You're Down and Out", 'End of the Line', "Ain't No Use", 'Strange Fruit'],
  },
  {
    title: 'Sound of Silver',
    artist: 'LCD Soundsystem',
    releaseYear: 2007,
    trackTitles: ['Get Innocuous!', 'Time to Get Away', 'North American Scum', 'Someone Great', 'All My Friends'],
  },
  {
    title: 'American Dream',
    artist: 'LCD Soundsystem',
    releaseYear: 2017,
    trackTitles: ['Oh Baby', 'Other Voices', 'I Used to', 'Change Yr Mind', 'How Do You Sleep?'],
  },
];

function randomDuration(): number {
  return 120 + Math.floor(Math.random() * 240);
}

async function main(): Promise<void> {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@auralis.app' },
    update: { passwordHash },
    create: {
      email: 'demo@auralis.app',
      username: 'demo',
      passwordHash,
      displayName: 'Demo User',
      isVerified: true,
    },
  });
  console.log(`Upserted demo user: ${demo.email} (password: demo1234)`);

  for (const a of ARTISTS) {
    await prisma.artist.upsert({
      where: { name: a.name },
      update: { bio: a.bio },
      create: { name: a.name, bio: a.bio },
    });
  }
  console.log(`Upserted ${ARTISTS.length} artists`);

  let albumCount = 0;
  let trackCount = 0;
  const firstTracks: string[] = [];

  for (const albumData of ALBUMS) {
    const artist = await prisma.artist.findUniqueOrThrow({
      where: { name: albumData.artist },
    });

    const existing = await prisma.album.findFirst({
      where: { title: albumData.title, artistId: artist.id },
    });

    const album = existing
      ? existing
      : await prisma.album.create({
          data: {
            title: albumData.title,
            artistId: artist.id,
            releaseYear: albumData.releaseYear,
          },
        });
    albumCount++;

    for (let i = 0; i < albumData.trackTitles.length; i++) {
      const trackExists = await prisma.track.findFirst({
        where: { title: albumData.trackTitles[i], albumId: album.id },
      });
      const track = trackExists
        ? trackExists
        : await prisma.track.create({
            data: {
              title: albumData.trackTitles[i],
              albumId: album.id,
              artistId: artist.id,
              duration: randomDuration(),
            },
          });
      if (i === 0) firstTracks.push(track.id);
      trackCount++;
    }
  }

  console.log(`Upserted ${albumCount} albums, ${trackCount} tracks`);

  const existingPlaylist = await prisma.playlist.findFirst({
    where: { title: 'My Favourites', ownerId: demo.id },
  });
  if (!existingPlaylist) {
    const playlist = await prisma.playlist.create({
      data: {
        title: 'My Favourites',
        description: 'A hand-picked collection of the best tracks.',
        ownerId: demo.id,
      },
    });
    for (let i = 0; i < Math.min(5, firstTracks.length); i++) {
      await prisma.playlistTrack.create({
        data: { playlistId: playlist.id, trackId: firstTracks[i], order: i + 1 },
      });
    }
    console.log(`Created demo playlist: ${playlist.title}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
