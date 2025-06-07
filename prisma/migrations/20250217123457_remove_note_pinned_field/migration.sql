-- 删除 Note 表中的 pinned 字段
ALTER TABLE "Note" DROP COLUMN IF EXISTS "pinned"; 