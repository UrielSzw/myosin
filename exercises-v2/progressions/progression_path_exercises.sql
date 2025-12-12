-- =============================================
-- PROGRESSION PATH EXERCISES
-- Links exercises to paths with unlock criteria
-- =============================================

-- Schema reminder:
-- progression_path_exercises: 
--   id, path_id, exercise_id, position, 
--   unlock_type ('sets_reps', 'time', 'prerequisite'),
--   unlock_sets, unlock_reps, unlock_seconds,
--   prerequisite_exercise_ids (array of exercise_ids that must be unlocked first)

-- Standard BWF Unlock Criteria:
-- Dynamic exercises: 3×8 reps
-- Isometric exercises: 3×30 seconds (60-70% of max per Prilepin tables)

-- =============================================
-- PATH 1: PULL-UP PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Start: Scapular Pulls → unlock with 3×15 (easy entry)
('22222222-0001-0000-0000-000000000001', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000001', 1, 'sets_reps', 3, 15, NULL),

-- Arch Hangs (isometric) → unlock with 3×30s
('22222222-0001-0000-0000-000000000002', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000002', 2, 'time', 3, NULL, 30),

-- Negative Pull-ups → unlock with 3×8 (5s each)
('22222222-0001-0000-0000-000000000003', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000003', 3, 'sets_reps', 3, 8, NULL),

-- Pull-ups (EXISTING EXERCISE) → unlock with 3×8
('22222222-0001-0000-0000-000000000004', '11111111-0001-0000-0000-000000000001', '40000000-0001-0000-0000-000000000001', 4, 'sets_reps', 3, 8, NULL),

-- === CORE NODE REACHED === 
-- From here, path branches into: Weighted OR L-sit Pull-ups OR Archer

-- Weighted Pull-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000005', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000004', 5, 'sets_reps', 3, 8, NULL),

-- L-sit Pull-ups (branch) → unlock with 3×8
('22222222-0001-0000-0000-000000000006', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000005', 5, 'sets_reps', 3, 8, NULL),

-- Archer Pull-ups (branch toward one-arm) → unlock with 3×8 each side
('22222222-0001-0000-0000-000000000007', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000006', 6, 'sets_reps', 3, 8, NULL),

-- Typewriter Pull-ups → unlock with 3×6
('22222222-0001-0000-0000-000000000008', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000007', 7, 'sets_reps', 3, 6, NULL),

-- One Arm Pull-up (ULTIMATE) → master
('22222222-0001-0000-0000-000000000009', '11111111-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000008', 8, 'sets_reps', 3, 3, NULL);


-- =============================================
-- PATH 2: ROW PROGRESSION → FRONT LEVER
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Incline Inverted Row (easy start) → unlock with 3×12
('22222222-0001-0000-0000-000000000010', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000014', 1, 'sets_reps', 3, 12, NULL),

-- Inverted Row (EXISTING) → unlock with 3×8
('22222222-0001-0000-0000-000000000011', '11111111-0001-0000-0000-000000000002', '40000000-0001-0000-0000-000000000018', 2, 'sets_reps', 3, 8, NULL),

-- Wide Grip Row → unlock with 3×8
('22222222-0001-0000-0000-000000000012', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000015', 3, 'sets_reps', 3, 8, NULL),

-- === BRANCH TO FRONT LEVER (separate path but connected) ===

-- Tuck Front Lever (isometric) → unlock with 3×30s
('22222222-0001-0000-0000-000000000013', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000016', 4, 'time', 3, NULL, 30),

-- Advanced Tuck Front Lever → unlock with 3×20s
('22222222-0001-0000-0000-000000000014', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000017', 5, 'time', 3, NULL, 20),

-- Straddle Front Lever → unlock with 3×15s
('22222222-0001-0000-0000-000000000015', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000018', 6, 'time', 3, NULL, 15),

-- Full Front Lever → unlock with 3×10s
('22222222-0001-0000-0000-000000000016', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000019', 7, 'time', 3, NULL, 10),

-- Front Lever Rows (ULTIMATE) → master
('22222222-0001-0000-0000-000000000017', '11111111-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000020', 8, 'sets_reps', 3, 5, NULL);


-- =============================================
-- PATH 3: DIP PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Support Hold (isometric) → unlock with 3×30s
('22222222-0001-0000-0000-000000000018', '11111111-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000021', 1, 'time', 3, NULL, 30),

-- Negative Dips → unlock with 3×8 (5s each)
('22222222-0001-0000-0000-000000000019', '11111111-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000022', 2, 'sets_reps', 3, 8, NULL),

-- Dips (EXISTING - Triceps Dips) → unlock with 3×8
('22222222-0001-0000-0000-000000000020', '11111111-0001-0000-0000-000000000003', '30000000-0001-0000-0000-000000000005', 3, 'sets_reps', 3, 8, NULL),

-- === CORE NODE REACHED ===
-- Branches: Weighted OR Ring

-- Weighted Dips → unlock with 3×8
('22222222-0001-0000-0000-000000000021', '11111111-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000023', 4, 'sets_reps', 3, 8, NULL),

-- Ring Dips → unlock with 3×8
('22222222-0001-0000-0000-000000000022', '11111111-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000024', 4, 'sets_reps', 3, 8, NULL),

-- RTO Support Hold (ULTIMATE for rings) → master with 3×30s
('22222222-0001-0000-0000-000000000023', '11111111-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000025', 5, 'time', 3, NULL, 30);


-- =============================================
-- PATH 4: PUSH-UP PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Wall Push-ups → unlock with 3×15
('22222222-0001-0000-0000-000000000024', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000026', 1, 'sets_reps', 3, 15, NULL),

-- Knee Push-ups → unlock with 3×12
('22222222-0001-0000-0000-000000000025', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000027', 2, 'sets_reps', 3, 12, NULL),

-- Push-ups (EXISTING) → unlock with 3×8
('22222222-0001-0000-0000-000000000026', '11111111-0001-0000-0000-000000000004', '10000000-0001-0000-0000-000000000012', 3, 'sets_reps', 3, 8, NULL),

-- === CORE NODE REACHED ===
-- Branches: Diamond (triceps) OR Archer (one-arm) OR Ring OR PPPU (planche)

-- Diamond Push-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000027', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000028', 4, 'sets_reps', 3, 8, NULL),

-- Archer Push-ups → unlock with 3×8 each side
('22222222-0001-0000-0000-000000000028', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000029', 4, 'sets_reps', 3, 8, NULL),

-- Pseudo Planche Push-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000029', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000030', 4, 'sets_reps', 3, 8, NULL),

-- Ring Push-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000030', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000031', 4, 'sets_reps', 3, 8, NULL),

-- RTO Push-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000031', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000032', 5, 'sets_reps', 3, 8, NULL),

-- One Arm Push-up (ULTIMATE) → master
('22222222-0001-0000-0000-000000000032', '11111111-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000033', 6, 'sets_reps', 3, 5, NULL);


-- =============================================
-- PATH 5: SQUAT PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Bodyweight Squat → unlock with 3×15
('22222222-0001-0000-0000-000000000033', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000044', 1, 'sets_reps', 3, 15, NULL),

-- Split Squat → unlock with 3×10 each leg
('22222222-0001-0000-0000-000000000034', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000045', 2, 'sets_reps', 3, 10, NULL),

-- Bulgarian Split Squat (EXISTING) → unlock with 3×8 each leg
('22222222-0001-0000-0000-000000000035', '11111111-0001-0000-0000-000000000005', '70000000-0001-0000-0000-000000000009', 3, 'sets_reps', 3, 8, NULL),

-- === CORE NODE REACHED ===
-- Branches: Pistol OR Shrimp

-- Assisted Pistol Squat → unlock with 3×8 each leg
('22222222-0001-0000-0000-000000000036', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000046', 4, 'sets_reps', 3, 8, NULL),

-- Pistol Squat → unlock with 3×5 each leg
('22222222-0001-0000-0000-000000000037', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000047', 5, 'sets_reps', 3, 5, NULL),

-- Beginner Shrimp Squat (alternative branch) → unlock with 3×8 each leg
('22222222-0001-0000-0000-000000000038', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000048', 4, 'sets_reps', 3, 8, NULL),

-- Advanced Shrimp Squat (ULTIMATE) → master
('22222222-0001-0000-0000-000000000039', '11111111-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000049', 5, 'sets_reps', 3, 5, NULL);


-- =============================================
-- PATH 6: HINGE PROGRESSION (Nordic Curls)
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Nordic Curl Negative → unlock with 3×8 (5s each)
('22222222-0001-0000-0000-000000000040', '11111111-0001-0000-0000-000000000006', '90000000-0001-0000-0000-000000000050', 1, 'sets_reps', 3, 8, NULL),

-- Banded Nordic Curl → unlock with 3×8
('22222222-0001-0000-0000-000000000041', '11111111-0001-0000-0000-000000000006', '90000000-0001-0000-0000-000000000051', 2, 'sets_reps', 3, 8, NULL),

-- Nordic Curl (ULTIMATE) → master
('22222222-0001-0000-0000-000000000042', '11111111-0001-0000-0000-000000000006', '90000000-0001-0000-0000-000000000052', 3, 'sets_reps', 3, 5, NULL);


-- =============================================
-- PATH 7: MUSCLE-UP PROGRESSION
-- Prerequisites: Pull-ups (3×8) + Dips (3×8)
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds, prerequisite_exercise_ids) VALUES

-- High Pull-ups (Chest to Bar) → unlock with 3×5
-- Requires: Pull-ups mastered
('22222222-0001-0000-0000-000000000043', '11111111-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000009', 1, 'sets_reps', 3, 5, NULL, ARRAY['40000000-0001-0000-0000-000000000001']),

-- False Grip Pull-ups → unlock with 3×5
('22222222-0001-0000-0000-000000000044', '11111111-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000010', 2, 'sets_reps', 3, 5, NULL, NULL),

-- Muscle-up Negative → unlock with 3×5 (5s each)
-- Requires: Dips mastered
('22222222-0001-0000-0000-000000000045', '11111111-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000011', 3, 'sets_reps', 3, 5, NULL, ARRAY['30000000-0001-0000-0000-000000000005']),

-- Muscle-up (Bar) → unlock with 3×3
('22222222-0001-0000-0000-000000000046', '11111111-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000012', 4, 'sets_reps', 3, 3, NULL, NULL),

-- Ring Muscle-up (ULTIMATE) → master
('22222222-0001-0000-0000-000000000047', '11111111-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000013', 5, 'sets_reps', 3, 3, NULL, NULL);


-- =============================================
-- PATH 8: HSPU PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Pike Push-ups → unlock with 3×10
('22222222-0001-0000-0000-000000000048', '11111111-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000034', 1, 'sets_reps', 3, 10, NULL),

-- Elevated Pike Push-ups → unlock with 3×8
('22222222-0001-0000-0000-000000000049', '11111111-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000035', 2, 'sets_reps', 3, 8, NULL),

-- Wall Handstand (isometric) → unlock with 3×30s
('22222222-0001-0000-0000-000000000050', '11111111-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000036', 3, 'time', 3, NULL, 30),

-- Wall HSPU → unlock with 3×8
('22222222-0001-0000-0000-000000000051', '11111111-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000037', 4, 'sets_reps', 3, 8, NULL),

-- Freestanding HSPU (ULTIMATE) → master
('22222222-0001-0000-0000-000000000052', '11111111-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000038', 5, 'sets_reps', 3, 3, NULL);


-- =============================================
-- PATH 9: L-SIT PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- Foot Supported L-sit → unlock with 3×30s
('22222222-0001-0000-0000-000000000053', '11111111-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000053', 1, 'time', 3, NULL, 30),

-- One Leg L-sit → unlock with 3×20s each leg
('22222222-0001-0000-0000-000000000054', '11111111-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000054', 2, 'time', 3, NULL, 20),

-- Tuck L-sit → unlock with 3×30s
('22222222-0001-0000-0000-000000000055', '11111111-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000055', 3, 'time', 3, NULL, 30),

-- L-sit → unlock with 3×20s
('22222222-0001-0000-0000-000000000056', '11111111-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000056', 4, 'time', 3, NULL, 20),

-- V-sit (ULTIMATE) → master with 3×10s
('22222222-0001-0000-0000-000000000057', '11111111-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000057', 5, 'time', 3, NULL, 10);


-- =============================================
-- PATH 10: FRONT LEVER PROGRESSION (Standalone)
-- Separate detailed path for Front Lever specialists
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds, prerequisite_exercise_ids) VALUES

-- Tuck Front Lever → unlock with 3×30s
-- Requires: Wide grip rows mastered
('22222222-0001-0000-0000-000000000058', '11111111-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000016', 1, 'time', 3, NULL, 30, ARRAY['40000000-0001-0000-0000-000000000018']),

-- Advanced Tuck Front Lever → unlock with 3×20s
('22222222-0001-0000-0000-000000000059', '11111111-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000017', 2, 'time', 3, NULL, 20, NULL),

-- Straddle Front Lever → unlock with 3×15s
('22222222-0001-0000-0000-000000000060', '11111111-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000018', 3, 'time', 3, NULL, 15, NULL),

-- Full Front Lever → unlock with 3×10s
('22222222-0001-0000-0000-000000000061', '11111111-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000019', 4, 'time', 3, NULL, 10, NULL),

-- Front Lever Rows (ULTIMATE) → master
('22222222-0001-0000-0000-000000000062', '11111111-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000020', 5, 'sets_reps', 3, 5, NULL, NULL);


-- =============================================
-- PATH 11: PLANCHE PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds, prerequisite_exercise_ids) VALUES

-- Frog Stand → unlock with 3×30s
-- Requires: PPPU mastered for proper lean
('22222222-0001-0000-0000-000000000063', '11111111-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000039', 1, 'time', 3, NULL, 30, ARRAY['90000000-0001-0000-0000-000000000030']),

-- Tuck Planche → unlock with 3×20s
('22222222-0001-0000-0000-000000000064', '11111111-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000040', 2, 'time', 3, NULL, 20, NULL),

-- Advanced Tuck Planche → unlock with 3×15s
('22222222-0001-0000-0000-000000000065', '11111111-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000041', 3, 'time', 3, NULL, 15, NULL),

-- Straddle Planche → unlock with 3×10s
('22222222-0001-0000-0000-000000000066', '11111111-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000042', 4, 'time', 3, NULL, 10, NULL),

-- Full Planche (ULTIMATE) → master with 3×5s
('22222222-0001-0000-0000-000000000067', '11111111-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000043', 5, 'time', 3, NULL, 5, NULL);


-- =============================================
-- PATH 12: BACK LEVER PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds) VALUES

-- German Hang → unlock with 3×30s
('22222222-0001-0000-0000-000000000068', '11111111-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000060', 1, 'time', 3, NULL, 30),

-- Skin the Cat → unlock with 3×5 reps
('22222222-0001-0000-0000-000000000069', '11111111-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000061', 2, 'sets_reps', 3, 5, NULL),

-- Tuck Back Lever → unlock with 3×20s
('22222222-0001-0000-0000-000000000070', '11111111-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000062', 3, 'time', 3, NULL, 20),

-- Full Back Lever (ULTIMATE) → master with 3×10s
('22222222-0001-0000-0000-000000000071', '11111111-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000063', 4, 'time', 3, NULL, 10);


-- =============================================
-- PATH 13: DRAGON FLAG PROGRESSION
-- =============================================

INSERT INTO progression_path_exercises (id, path_id, exercise_id, position, unlock_type, unlock_sets, unlock_reps, unlock_seconds, prerequisite_exercise_ids) VALUES

-- Dragon Flag Tuck → unlock with 3×10
-- Requires: Plancha Frontal (plank) for core foundation
('22222222-0001-0000-0000-000000000072', '11111111-0001-0000-0000-000000000013', '90000000-0001-0000-0000-000000000058', 1, 'sets_reps', 3, 10, NULL, ARRAY['60000000-0001-0000-0000-000000000007']),

-- Dragon Flag Full (ULTIMATE) → master with 3×8
('22222222-0001-0000-0000-000000000073', '11111111-0001-0000-0000-000000000013', '90000000-0001-0000-0000-000000000059', 2, 'sets_reps', 3, 8, NULL, NULL);

