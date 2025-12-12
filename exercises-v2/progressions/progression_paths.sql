-- =============================================
-- PROGRESSION PATHS DEFINITION
-- Defines the skill trees for calisthenics progressions
-- =============================================

-- Schema:
-- progression_paths: id, slug, name_key, description_key, category, ultimate_exercise_id, icon, color

-- Categories (from Supabase check constraint):
-- 'vertical_pull', 'horizontal_pull', 'vertical_push', 'horizontal_push', 'squat', 'hinge', 'core', 'skill'

INSERT INTO progression_paths (id, slug, name_key, description_key, category, ultimate_exercise_id, icon, color) VALUES

-- =============================================
-- FOUNDATIONAL PATHS (Phase 1)
-- These are the 6 core movement patterns everyone should master
-- =============================================

-- 1. Pull-up Path (Vertical Pull)
(
  '11111111-0001-0000-0000-000000000001',
  'pull_up',
  'paths.pull_up.name',
  'paths.pull_up.description',
  'vertical_pull',
  '90000000-0001-0000-0000-000000000008', -- One Arm Pull-up
  'arrow-up',
  '#3B82F6'
),

-- 2. Row Path (Horizontal Pull)
(
  '11111111-0001-0000-0000-000000000002',
  'row',
  'paths.row.name',
  'paths.row.description',
  'horizontal_pull',
  '90000000-0001-0000-0000-000000000020', -- Front Lever Rows
  'arrow-left',
  '#6366F1'
),

-- 3. Dip Path (Vertical Push)
(
  '11111111-0001-0000-0000-000000000003',
  'dip',
  'paths.dip.name',
  'paths.dip.description',
  'vertical_push',
  '90000000-0001-0000-0000-000000000025', -- RTO Support Hold
  'arrow-down',
  '#EF4444'
),

-- 4. Push-up Path (Horizontal Push)
(
  '11111111-0001-0000-0000-000000000004',
  'push_up',
  'paths.push_up.name',
  'paths.push_up.description',
  'horizontal_push',
  '90000000-0001-0000-0000-000000000033', -- One Arm Push-up
  'arrow-right',
  '#F97316'
),

-- 5. Squat Path (Lower Body Push)
(
  '11111111-0001-0000-0000-000000000005',
  'squat',
  'paths.squat.name',
  'paths.squat.description',
  'squat',
  '90000000-0001-0000-0000-000000000049', -- Advanced Shrimp Squat
  'trending-down',
  '#22C55E'
),

-- 6. Hinge Path (Lower Body Pull)
(
  '11111111-0001-0000-0000-000000000006',
  'hinge',
  'paths.hinge.name',
  'paths.hinge.description',
  'hinge',
  '90000000-0001-0000-0000-000000000052', -- Nordic Curl
  'git-merge',
  '#10B981'
),

-- =============================================
-- INTERMEDIATE SKILL PATHS (Phase 2)
-- Unlock after mastering foundational movements
-- =============================================

-- 7. Muscle-up Path (Branch from Pull-up + Dip)
(
  '11111111-0001-0000-0000-000000000007',
  'muscle_up',
  'paths.muscle_up.name',
  'paths.muscle_up.description',
  'skill',
  '90000000-0001-0000-0000-000000000013', -- Ring Muscle-up
  'zap',
  '#FBBF24'
),

-- 8. HSPU Path (Branch from Push-up + Handstand)
(
  '11111111-0001-0000-0000-000000000008',
  'hspu',
  'paths.hspu.name',
  'paths.hspu.description',
  'vertical_push',
  '90000000-0001-0000-0000-000000000038', -- Freestanding HSPU
  'corner-up-left',
  '#EC4899'
),

-- 9. L-sit Path (Core Compression)
(
  '11111111-0001-0000-0000-000000000009',
  'l_sit',
  'paths.l_sit.name',
  'paths.l_sit.description',
  'core',
  '90000000-0001-0000-0000-000000000057', -- V-sit
  'corner-down-right',
  '#8B5CF6'
),

-- 10. Front Lever Path (Branch from Row)
(
  '11111111-0001-0000-0000-000000000010',
  'front_lever',
  'paths.front_lever.name',
  'paths.front_lever.description',
  'horizontal_pull',
  '90000000-0001-0000-0000-000000000019', -- Full Front Lever
  'minus',
  '#0EA5E9'
),

-- =============================================
-- ADVANCED SKILL PATHS (Phase 3)
-- For dedicated calisthenics athletes
-- =============================================

-- 11. Planche Path (Ultimate Push)
(
  '11111111-0001-0000-0000-000000000011',
  'planche',
  'paths.planche.name',
  'paths.planche.description',
  'horizontal_push',
  '90000000-0001-0000-0000-000000000043', -- Full Planche
  'maximize',
  '#DC2626'
),

-- 12. Back Lever Path (Shoulder Flexibility + Strength)
(
  '11111111-0001-0000-0000-000000000012',
  'back_lever',
  'paths.back_lever.name',
  'paths.back_lever.description',
  'horizontal_pull',
  '90000000-0001-0000-0000-000000000063', -- Full Back Lever
  'maximize-2',
  '#7C3AED'
),

-- 13. Dragon Flag Path (Advanced Core)
(
  '11111111-0001-0000-0000-000000000013',
  'dragon_flag',
  'paths.dragon_flag.name',
  'paths.dragon_flag.description',
  'core',
  '90000000-0001-0000-0000-000000000059', -- Dragon Flag Full
  'flag',
  '#A855F7'
);

