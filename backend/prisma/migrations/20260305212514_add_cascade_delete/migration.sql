-- DropForeignKey
ALTER TABLE "RoadmapItem" DROP CONSTRAINT "RoadmapItem_postId_fkey";

-- AddForeignKey
ALTER TABLE "RoadmapItem" ADD CONSTRAINT "RoadmapItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
