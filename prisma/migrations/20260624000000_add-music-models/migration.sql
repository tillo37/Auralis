-- AlterTable: artists — rename imageUrl → avatarUrl, add verified
ALTER TABLE "artists" RENAME COLUMN "imageUrl" TO "avatarUrl";
ALTER TABLE "artists" ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: tracks — replace old fields with spec fields
ALTER TABLE "tracks" DROP CONSTRAINT IF EXISTS "tracks_albumId_fkey";
ALTER TABLE "tracks" ALTER COLUMN "albumId" DROP NOT NULL;
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "trackNumber";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "durationSeconds";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "audioUrl";
ALTER TABLE "tracks" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tracks" ADD COLUMN "fileUrl" TEXT;
ALTER TABLE "tracks" ADD COLUMN "coverUrl" TEXT;
ALTER TABLE "tracks" ADD COLUMN "playCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey"
  FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: playlists
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable: playlist_tracks
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: liked_tracks
CREATE TABLE "liked_tracks" (
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "liked_tracks_pkey" PRIMARY KEY ("userId","trackId")
);

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlistId_fkey"
  FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_trackId_fkey"
  FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_tracks" ADD CONSTRAINT "liked_tracks_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "liked_tracks" ADD CONSTRAINT "liked_tracks_trackId_fkey"
  FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_playlistId_trackId_key"
  ON "playlist_tracks"("playlistId", "trackId");
