-- =============================================
-- EXERCISE PROGRESSIONS
-- Direct relationships between exercises for unlock system
-- =============================================

-- Schema reminder:
-- exercise_progressions:
--   id, from_exercise_id, to_exercise_id, relationship_type,
--   unlock_type ('sets_reps', 'time', 'manual'),
--   unlock_sets, unlock_reps, unlock_seconds,
--   difficulty_delta, notes

-- Relationship types:
-- 'progression'  = from is easier than to (most common)
-- 'prerequisite' = from is REQUIRED for to (skill unlocks)
-- 'variation'    = same difficulty level alternatives
-- 'regression'   = from is harder than to (reverse lookup)

-- UUID prefix: 33333333-0001-0000-0000-00000000XXXX

-- Standard BWF unlock criteria:
-- Dynamic exercises: 3×8 reps (unlock) → 3×12 (mastery)
-- Isometric exercises: 3×30s (unlock) → 3×60s (mastery)


-- =============================================
-- PULL-UP PROGRESSION CHAIN
-- Scapular Pulls → Arch Hangs → Negative Pull-ups → Pull-ups → 
-- [Weighted | L-sit | Archer] → Typewriter → One Arm
-- =============================================

INSERT INTO exercise_progressions (id, from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, notes) VALUES
-- Scapular Pulls → Arch Hangs
('33333333-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000002', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 15}', 1, 'Build scapular control before active hang'),
-- Arch Hangs → Negative Pull-ups
('33333333-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000002', '90000000-0001-0000-0000-000000000003', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Active hang endurance before eccentrics'),
-- Negative Pull-ups → Pull-ups (existing exercise)
('33333333-0001-0000-0000-000000000003', '90000000-0001-0000-0000-000000000003', '40000000-0001-0000-0000-000000000001', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, '3×8 slow negatives (5s each) to unlock full pull-ups'),
-- Pull-ups → Weighted Pull-ups
('33333333-0001-0000-0000-000000000004', '40000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000004', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 1, 'Master bodyweight before adding load'),
-- Pull-ups → L-sit Pull-ups (branch)
('33333333-0001-0000-0000-000000000005', '40000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000005', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Requires L-sit hold capacity as well'),
-- Pull-ups → Archer Pull-ups (branch toward one-arm)
('33333333-0001-0000-0000-000000000006', '40000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000006', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 2, 'Wide grip and asymmetric strength needed'),
-- Archer Pull-ups → Typewriter Pull-ups
('33333333-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000006', '90000000-0001-0000-0000-000000000007', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Dynamic version of archer position'),
-- Typewriter Pull-ups → One Arm Pull-up
('33333333-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000008', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 6}', 1, 'Ultimate one-arm strength goal'),
-- Weighted Pull-ups → One Arm Pull-up (alternative path)
('33333333-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000008', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Need ~50% BW added weight before attempting'),

-- =============================================
-- MUSCLE-UP PROGRESSION CHAIN
-- Prerequisites: Pull-ups + Dips (both mastered)
-- High Pull-ups → False Grip → Negative Muscle-up → Bar Muscle-up → Ring Muscle-up
-- =============================================

-- Pull-ups → High Pull-ups (prerequisite)
('33333333-0001-0000-0000-000000000010', '40000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000009', 'prerequisite', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Must pull explosively to chest level'),
-- High Pull-ups → False Grip Pull-ups
('33333333-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000010', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 5}', 1, 'Learn false grip for transition'),
-- Dips → Muscle-up Negative (prerequisite)
('33333333-0001-0000-0000-000000000012', '30000000-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000011', 'prerequisite', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Dip strength essential for transition phase'),
-- False Grip Pull-ups → Muscle-up Negative
('33333333-0001-0000-0000-000000000013', '90000000-0001-0000-0000-000000000010', '90000000-0001-0000-0000-000000000011', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 5}', 1, 'Practice the transition slowly'),
-- Muscle-up Negative → Bar Muscle-up
('33333333-0001-0000-0000-000000000014', '90000000-0001-0000-0000-000000000011', '90000000-0001-0000-0000-000000000012', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 5}', 1, '5s negatives teach the movement pattern'),
-- Bar Muscle-up → Ring Muscle-up
('33333333-0001-0000-0000-000000000015', '90000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000013', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 5}', 1, 'Rings require more stabilization'),

-- =============================================
-- ROW / FRONT LEVER PROGRESSION CHAIN (primeros 5)
-- =============================================

-- Incline Inverted Row → Inverted Row (existing)
('33333333-0001-0000-0000-000000000016', '90000000-0001-0000-0000-000000000014', '40000000-0001-0000-0000-000000000018', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 1, 'Progress to horizontal position'),
-- Inverted Row → Wide Grip Row
('33333333-0001-0000-0000-000000000017', '40000000-0001-0000-0000-000000000018', '90000000-0001-0000-0000-000000000015', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Wide grip emphasizes upper back'),
-- Wide Grip Row → Tuck Front Lever
('33333333-0001-0000-0000-000000000018', '90000000-0001-0000-0000-000000000015', '90000000-0001-0000-0000-000000000016', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 2, 'Transition to isometric lever work'),
-- Tuck Front Lever → Advanced Tuck Front Lever
('33333333-0001-0000-0000-000000000019', '90000000-0001-0000-0000-000000000016', '90000000-0001-0000-0000-000000000017', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Extend hips slightly more'),
-- Advanced Tuck Front Lever → Straddle Front Lever
('33333333-0001-0000-0000-000000000020', '90000000-0001-0000-0000-000000000017', '90000000-0001-0000-0000-000000000018', 'progression', '{"type": "time", "sets": 3, "seconds": 20}', 1, 'Open legs to straddle position');


-- =============================================
-- ROW / FRONT LEVER CONTINUATION (021-022)
-- =============================================

INSERT INTO exercise_progressions (id, from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, notes) VALUES
-- Straddle Front Lever → Full Front Lever
('33333333-0001-0000-0000-000000000021', '90000000-0001-0000-0000-000000000018', '90000000-0001-0000-0000-000000000019', 'progression', '{"type": "time", "sets": 3, "seconds": 15}', 1, 'Bring legs together for full'),
-- Full Front Lever → Front Lever Rows
('33333333-0001-0000-0000-000000000022', '90000000-0001-0000-0000-000000000019', '90000000-0001-0000-0000-000000000020', 'progression', '{"type": "time", "sets": 3, "seconds": 10}', 1, 'Dynamic rows in FL position'),

-- =============================================
-- DIP PROGRESSION CHAIN (023-027)
-- =============================================

-- Support Hold → Negative Dips
('33333333-0001-0000-0000-000000000023', '90000000-0001-0000-0000-000000000021', '90000000-0001-0000-0000-000000000022', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Build support strength first'),
-- Negative Dips → Dips (existing)
('33333333-0001-0000-0000-000000000024', '90000000-0001-0000-0000-000000000022', '30000000-0001-0000-0000-000000000005', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, '5s negatives to unlock full dips'),
-- Dips → Weighted Dips
('33333333-0001-0000-0000-000000000025', '30000000-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000023', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 1, 'Master bodyweight before adding load'),
-- Dips → Ring Dips (branch)
('33333333-0001-0000-0000-000000000026', '30000000-0001-0000-0000-000000000005', '90000000-0001-0000-0000-000000000024', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 2, 'Rings add instability challenge'),
-- Ring Dips → RTO Support Hold
('33333333-0001-0000-0000-000000000027', '90000000-0001-0000-0000-000000000024', '90000000-0001-0000-0000-000000000025', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Turn rings out at top position'),

-- =============================================
-- PUSH-UP PROGRESSION CHAIN (028-035)
-- =============================================

-- Wall Push-ups → Knee Push-ups
('33333333-0001-0000-0000-000000000028', '90000000-0001-0000-0000-000000000026', '90000000-0001-0000-0000-000000000027', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 15}', 1, 'Progress from vertical to incline'),
-- Knee Push-ups → Push-ups (existing)
('33333333-0001-0000-0000-000000000029', '90000000-0001-0000-0000-000000000027', '10000000-0001-0000-0000-000000000012', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 1, 'Full body push-up'),
-- Push-ups → Diamond Push-ups (triceps branch)
('33333333-0001-0000-0000-000000000030', '10000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000028', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Narrow hand position for triceps'),
-- Push-ups → Archer Push-ups (one-arm path)
('33333333-0001-0000-0000-000000000031', '10000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000029', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 2, 'Asymmetric load toward one arm'),
-- Push-ups → Pseudo Planche Push-ups (planche path)
('33333333-0001-0000-0000-000000000032', '10000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000030', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 2, 'Forward lean for planche prep'),
-- Push-ups → Ring Push-ups (instability branch)
('33333333-0001-0000-0000-000000000033', '10000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000031', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Rings add stabilization work'),
-- Ring Push-ups → RTO Push-ups
('33333333-0001-0000-0000-000000000034', '90000000-0001-0000-0000-000000000031', '90000000-0001-0000-0000-000000000032', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Turn rings out at top'),
-- Archer Push-ups → One Arm Push-up
('33333333-0001-0000-0000-000000000035', '90000000-0001-0000-0000-000000000029', '90000000-0001-0000-0000-000000000033', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 2, 'Ultimate unilateral push'),

-- =============================================
-- HSPU PROGRESSION CHAIN (036-039)
-- =============================================

-- Pike Push-ups → Elevated Pike Push-ups
('33333333-0001-0000-0000-000000000036', '90000000-0001-0000-0000-000000000034', '90000000-0001-0000-0000-000000000035', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Elevate feet for more vertical angle'),
-- Elevated Pike Push-ups → Wall Handstand
('33333333-0001-0000-0000-000000000037', '90000000-0001-0000-0000-000000000035', '90000000-0001-0000-0000-000000000036', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Learn to hold inverted position'),
-- Wall Handstand → Wall HSPU
('33333333-0001-0000-0000-000000000038', '90000000-0001-0000-0000-000000000036', '90000000-0001-0000-0000-000000000037', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Add pressing movement'),
-- Wall HSPU → Freestanding HSPU
('33333333-0001-0000-0000-000000000039', '90000000-0001-0000-0000-000000000037', '90000000-0001-0000-0000-000000000038', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 2, 'Balance + pressing combined'),

-- =============================================
-- PLANCHE PROGRESSION START (040)
-- =============================================

-- Pseudo Planche Push-ups → Frog Stand (prerequisite)
('33333333-0001-0000-0000-000000000040', '90000000-0001-0000-0000-000000000030', '90000000-0001-0000-0000-000000000039', 'prerequisite', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Learn forward lean first');


-- =============================================
-- PLANCHE PROGRESSION (041-044)
-- =============================================

INSERT INTO exercise_progressions (id, from_exercise_id, to_exercise_id, relationship_type, unlock_criteria, difficulty_delta, notes) VALUES
-- Frog Stand → Tuck Planche
('33333333-0001-0000-0000-000000000041', '90000000-0001-0000-0000-000000000039', '90000000-0001-0000-0000-000000000040', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 2, 'Lift knees off elbows'),
-- Tuck Planche → Advanced Tuck Planche
('33333333-0001-0000-0000-000000000042', '90000000-0001-0000-0000-000000000040', '90000000-0001-0000-0000-000000000041', 'progression', '{"type": "time", "sets": 3, "seconds": 20}', 1, 'Flatten back, extend hips slightly'),
-- Advanced Tuck Planche → Straddle Planche
('33333333-0001-0000-0000-000000000043', '90000000-0001-0000-0000-000000000041', '90000000-0001-0000-0000-000000000042', 'progression', '{"type": "time", "sets": 3, "seconds": 15}', 2, 'Open legs to straddle'),
-- Straddle Planche → Full Planche
('33333333-0001-0000-0000-000000000044', '90000000-0001-0000-0000-000000000042', '90000000-0001-0000-0000-000000000043', 'progression', '{"type": "time", "sets": 3, "seconds": 10}', 2, 'Bring legs together - ultimate goal'),

-- =============================================
-- SQUAT PROGRESSION (045-051)
-- =============================================

-- Bodyweight Squat → Split Squat
('33333333-0001-0000-0000-000000000045', '90000000-0001-0000-0000-000000000044', '90000000-0001-0000-0000-000000000045', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 15}', 1, 'Build basic squat pattern'),
-- Split Squat → Bulgarian Split Squat (existing)
('33333333-0001-0000-0000-000000000046', '90000000-0001-0000-0000-000000000045', '70000000-0001-0000-0000-000000000009', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Elevate rear foot'),
-- Bulgarian → Assisted Pistol (pistol path)
('33333333-0001-0000-0000-000000000047', '70000000-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000046', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Use support for single leg squat'),
-- Assisted Pistol → Pistol Squat
('33333333-0001-0000-0000-000000000048', '90000000-0001-0000-0000-000000000046', '90000000-0001-0000-0000-000000000047', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Remove assistance'),
-- Bulgarian → Beginner Shrimp (shrimp path)
('33333333-0001-0000-0000-000000000049', '70000000-0001-0000-0000-000000000009', '90000000-0001-0000-0000-000000000048', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Hold rear foot behind'),
-- Beginner Shrimp → Advanced Shrimp
('33333333-0001-0000-0000-000000000050', '90000000-0001-0000-0000-000000000048', '90000000-0001-0000-0000-000000000049', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Rear knee touches ground'),
-- Pistol ↔ Advanced Shrimp (variations)
('33333333-0001-0000-0000-000000000051', '90000000-0001-0000-0000-000000000047', '90000000-0001-0000-0000-000000000049', 'variation', NULL, 0, 'Different single-leg squat patterns'),

-- =============================================
-- HINGE PROGRESSION (052-053)
-- =============================================

-- Nordic Curl Negative → Banded Nordic Curl
('33333333-0001-0000-0000-000000000052', '90000000-0001-0000-0000-000000000050', '90000000-0001-0000-0000-000000000051', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Control 5s negatives first'),
-- Banded Nordic Curl → Full Nordic Curl
('33333333-0001-0000-0000-000000000053', '90000000-0001-0000-0000-000000000051', '90000000-0001-0000-0000-000000000052', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 8}', 1, 'Remove band assistance'),

-- =============================================
-- L-SIT PROGRESSION (054-057)
-- =============================================

-- Foot Supported L-sit → One Leg L-sit
('33333333-0001-0000-0000-000000000054', '90000000-0001-0000-0000-000000000053', '90000000-0001-0000-0000-000000000054', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Lift one foot at a time'),
-- One Leg L-sit → Tuck L-sit
('33333333-0001-0000-0000-000000000055', '90000000-0001-0000-0000-000000000054', '90000000-0001-0000-0000-000000000055', 'progression', '{"type": "time", "sets": 3, "seconds": 20}', 1, 'Both feet off ground, tucked'),
-- Tuck L-sit → Full L-sit
('33333333-0001-0000-0000-000000000056', '90000000-0001-0000-0000-000000000055', '90000000-0001-0000-0000-000000000056', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Extend legs fully'),
-- L-sit → V-sit
('33333333-0001-0000-0000-000000000057', '90000000-0001-0000-0000-000000000056', '90000000-0001-0000-0000-000000000057', 'progression', '{"type": "time", "sets": 3, "seconds": 20}', 2, 'Lift legs above horizontal'),

-- =============================================
-- DRAGON FLAG PROGRESSION (058-059)
-- =============================================

-- Plank → Dragon Flag Tuck (prerequisite)
('33333333-0001-0000-0000-000000000058', '60000000-0001-0000-0000-000000000007', '90000000-0001-0000-0000-000000000058', 'prerequisite', '{"type": "time", "sets": 3, "seconds": 60}', 2, 'Core strength foundation required'),
-- Dragon Flag Tuck → Dragon Flag Full
('33333333-0001-0000-0000-000000000059', '90000000-0001-0000-0000-000000000058', '90000000-0001-0000-0000-000000000059', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 10}', 1, 'Extend body fully'),

-- =============================================
-- BACK LEVER PROGRESSION (060-062)
-- =============================================

-- German Hang → Skin the Cat
('33333333-0001-0000-0000-000000000060', '90000000-0001-0000-0000-000000000060', '90000000-0001-0000-0000-000000000061', 'progression', '{"type": "time", "sets": 3, "seconds": 30}', 1, 'Build shoulder flexibility'),
-- Skin the Cat → Tuck Back Lever
('33333333-0001-0000-0000-000000000061', '90000000-0001-0000-0000-000000000061', '90000000-0001-0000-0000-000000000062', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 5}', 1, 'Stop in tucked position'),
-- Tuck Back Lever → Full Back Lever
('33333333-0001-0000-0000-000000000062', '90000000-0001-0000-0000-000000000062', '90000000-0001-0000-0000-000000000063', 'progression', '{"type": "time", "sets": 3, "seconds": 20}', 2, 'Extend body fully'),

-- =============================================
-- CROSS-PATH CONNECTIONS (063-067)
-- =============================================

-- L-sit → L-sit Pull-ups (core + pull combination)
('33333333-0001-0000-0000-000000000063', '90000000-0001-0000-0000-000000000056', '90000000-0001-0000-0000-000000000005', 'prerequisite', '{"type": "time", "sets": 3, "seconds": 15}', 0, 'Must hold L-sit before combining with pull-ups'),
-- Pull-ups + L-sit → L-sit Pull-ups
('33333333-0001-0000-0000-000000000064', '40000000-0001-0000-0000-000000000001', '90000000-0001-0000-0000-000000000005', 'prerequisite', '{"type": "sets_reps", "sets": 3, "reps": 8}', 0, 'Pull-up strength also required'),
-- PPPU → Planche path connection
('33333333-0001-0000-0000-000000000065', '90000000-0001-0000-0000-000000000030', '90000000-0001-0000-0000-000000000040', 'progression', '{"type": "sets_reps", "sets": 3, "reps": 12}', 2, 'Strong PPPU opens planche training'),
-- RTO Push-ups → RTO Dips connection
('33333333-0001-0000-0000-000000000066', '90000000-0001-0000-0000-000000000032', '90000000-0001-0000-0000-000000000025', 'prerequisite', '{"type": "sets_reps", "sets": 3, "reps": 8}', 0, 'RTO strength transfers between movements'),
-- Wall Handstand → Freestanding prerequisite (balance)
('33333333-0001-0000-0000-000000000067', '90000000-0001-0000-0000-000000000036', '90000000-0001-0000-0000-000000000038', 'prerequisite', '{"type": "time", "sets": 3, "seconds": 60}', 0, 'Need 60s wall handstand for freestanding attempts'),

-- =============================================
-- VARIATION RELATIONSHIPS (068-073)
-- =============================================

-- Diamond Push-ups ↔ Archer Push-ups (push-up variations)
('33333333-0001-0000-0000-000000000068', '90000000-0001-0000-0000-000000000028', '90000000-0001-0000-0000-000000000029', 'variation', NULL, 0, 'Different emphasis: triceps vs unilateral'),
-- Weighted Pull-ups ↔ Archer Pull-ups (pull-up variations)
('33333333-0001-0000-0000-000000000069', '90000000-0001-0000-0000-000000000004', '90000000-0001-0000-0000-000000000006', 'variation', NULL, 0, 'Load vs asymmetric approaches'),
-- Bar Muscle-up ↔ Ring Muscle-up
('33333333-0001-0000-0000-000000000070', '90000000-0001-0000-0000-000000000012', '90000000-0001-0000-0000-000000000013', 'variation', NULL, 0, 'Bar vs ring versions'),
-- Weighted Dips ↔ Ring Dips
('33333333-0001-0000-0000-000000000071', '90000000-0001-0000-0000-000000000023', '90000000-0001-0000-0000-000000000024', 'variation', NULL, 0, 'Load vs instability approaches'),
-- Full Front Lever ↔ Full Back Lever
('33333333-0001-0000-0000-000000000072', '90000000-0001-0000-0000-000000000019', '90000000-0001-0000-0000-000000000063', 'variation', NULL, 0, 'Opposite lever positions'),
-- One Arm Pull-up ↔ One Arm Push-up (ultimate unilateral)
('33333333-0001-0000-0000-000000000073', '90000000-0001-0000-0000-000000000008', '90000000-0001-0000-0000-000000000033', 'variation', NULL, 0, 'Ultimate unilateral pull vs push');
