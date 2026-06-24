-- AlterTable: artists — rename imageUrl → avatarUrl, add verified
ALTER TABLE "artists" RENAME COLUMN "image_url" TO "avatar_url";
ALTER TABLE "artists" ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: tracks — replace old fields with spec fields
ALTER TABLE "tracks" DROP CONSTRAINT IF EXISTS "tracks_album_id_fkey";
ALTER TABLE "tracks" ALTER COLUMN "album_id" DROP NOT NULL;
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "track_number";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "duration_seconds";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "audio_url";
ALTER TABLE "tracks" ADD COLUMN "duration" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tracks" ADD COLUMN "file_url" TEXT;
ALTER TABLE "tracks" ADD COLUMN "cover_url" TEXT;
ALTER TABLE "tracks" ADD COLUMN "play_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey"
  FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: playlists
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable: playlist_tracks
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: liked_tracks
CREATE TABLE "liked_tracks" (
    "user_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "liked_tracks_pkey" PRIMARY KEY ("user_id","track_id")
);

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_owner_id_fkey"
  FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_fkey"
  FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_fkey"
  FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_tracks" ADD CONSTRAINT "liked_tracks_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "liked_tracks" ADD CONSTRAINT "liked_tracks_track_id_fkey"
  FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_playlist_id_track_id_key"
  ON "playlist_tracks"("playlist_id", "track_id");
