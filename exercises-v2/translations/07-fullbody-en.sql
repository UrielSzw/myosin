-- =============================================
-- FULL BODY EXERCISES - ENGLISH TRANSLATIONS
-- =============================================

-- ==================== DEADLIFT VARIATIONS ====================

-- 1. Barbell conventional deadlift
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000001',
  'en',
  'Barbell conventional deadlift',
  'barbell conventional deadlift',
  '[
    "Stand with feet hip-width apart, barbell over feet.",
    "Bend down and grip barbell with overhand or mixed grip.",
    "Keep back straight, chest up, shoulders over the bar.",
    "Push floor away with feet lifting the barbell.",
    "Extend hips and knees simultaneously until standing upright.",
    "Lower in controlled manner keeping bar close to body."
  ]',
  '[
    "Rounding lower back during lift",
    "Letting bar drift away from body",
    "Hyperextending back at top",
    "Hips rising first losing back tension"
  ]'
);

-- 2. Trap bar deadlift
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000002',
  'en',
  'Trap bar deadlift',
  'trap bar hex bar deadlift',
  '[
    "Stand inside trap bar with feet hip-width apart.",
    "Bend down and grip side handles.",
    "Keep back straight and chest up.",
    "Push floor away extending legs and hips.",
    "Stand completely upright at top.",
    "Lower in controlled manner bending hips and knees."
  ]',
  '[
    "Rounding back during movement",
    "Not keeping torso centered in bar",
    "Locking knees before hips",
    "Leaning too far forward"
  ]'
);

-- ==================== OLYMPIC LIFTS ====================

-- 3. Hang clean
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000003',
  'en',
  'Hang clean',
  'hang clean olympic barbell',
  '[
    "Stand holding barbell with overhand grip at thigh height.",
    "Slightly bend hips and knees (hang position).",
    "Explosively extend hips, knees, and ankles.",
    "Shrug shoulders and pull bar upward.",
    "Rotate elbows forward catching bar on shoulders.",
    "Absorb weight by bending knees in the catch."
  ]',
  '[
    "Pulling with arms instead of hip extension",
    "Not completing triple extension",
    "Catching bar with elbows low",
    "Not bending knees in the catch"
  ]'
);

-- 4. Power clean
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000004',
  'en',
  'Power clean',
  'power clean barbell olympic',
  '[
    "Position barbell over feet, overhand grip at shoulder width.",
    "Squat down with back straight, shoulders over bar.",
    "Lift bar keeping it close to body (first pull).",
    "As bar passes knees, explosively extend hips (second pull).",
    "Shrug shoulders and pull bar upward.",
    "Rotate elbows catching bar on shoulders in quarter squat."
  ]',
  '[
    "Pulling with arms too early",
    "Letting bar drift away from body",
    "Not completing hip extension",
    "Catching with torso leaning forward"
  ]'
);

-- 5. Hang snatch
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000005',
  'en',
  'Hang snatch',
  'hang snatch olympic barbell',
  '[
    "Grip barbell with very wide overhand grip (snatch grip).",
    "Stand with bar at thigh height, slight hip bend.",
    "Explosively extend hips, knees, and ankles.",
    "Pull bar upward close to body.",
    "Drop under bar extending it overhead.",
    "Stabilize with arms locked out overhead."
  ]',
  '[
    "Grip too narrow",
    "Pulling with arms instead of hips",
    "Not keeping bar close to body",
    "Pressing bar instead of dropping under"
  ]'
);

-- 6. Dumbbell snatch
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000006',
  'en',
  'Dumbbell snatch',
  'dumbbell snatch single arm unilateral',
  '[
    "Stand with feet shoulder-width apart, dumbbell between feet.",
    "Squat down and grip dumbbell with one hand.",
    "Explosively extend lifting the dumbbell.",
    "Pull elbow up and back.",
    "Rotate arm catching dumbbell overhead.",
    "Stabilize with arm fully extended overhead."
  ]',
  '[
    "Not using enough hip extension",
    "Pressing dumbbell instead of pulling",
    "Not stabilizing core during movement",
    "Catching with arm bent"
  ]'
);

-- ==================== THRUSTERS ====================

-- 7. Barbell thruster
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000007',
  'en',
  'Barbell thruster',
  'barbell thruster squat press combination',
  '[
    "Hold barbell in front squat position (on shoulders).",
    "Feet shoulder-width apart, elbows high.",
    "Descend into a deep controlled squat.",
    "Drive up explosively from the bottom.",
    "Use momentum to press barbell overhead.",
    "Lower bar to shoulders while descending for next rep."
  ]',
  '[
    "Separating squat from press (should be one fluid motion)",
    "Letting elbows drop in the squat",
    "Not reaching full squat depth",
    "Pressing before completing leg extension"
  ]'
);

-- 8. Dumbbell thruster
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000008',
  'en',
  'Dumbbell thruster',
  'dumbbell thruster squat press combination',
  '[
    "Hold dumbbells at shoulder height, palms facing each other.",
    "Feet shoulder-width apart.",
    "Descend into deep squat keeping torso upright.",
    "Drive up explosively from the bottom.",
    "Use momentum to press dumbbells overhead.",
    "Lower dumbbells while descending for next rep."
  ]',
  '[
    "Leaning torso forward in squat",
    "Not syncing press with the drive up",
    "Pressing with arms without using leg drive",
    "Not reaching full extension overhead"
  ]'
);

-- ==================== KETTLEBELL ====================

-- 9. Kettlebell swing
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000009',
  'en',
  'Kettlebell swing',
  'kettlebell swing hip hinge',
  '[
    "Stand with feet slightly wider than shoulder-width.",
    "Grip kettlebell with both hands, arms extended.",
    "Perform hip hinge swinging kettlebell between legs.",
    "Explosively extend hips projecting kettlebell forward.",
    "Let it rise to shoulder height or overhead.",
    "Control descent returning to hip hinge position."
  ]',
  '[
    "Squatting instead of hip hinging",
    "Lifting with arms instead of hips",
    "Rounding back on descent",
    "Not squeezing glutes at extension"
  ]'
);

-- 10. Kettlebell clean and press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000010',
  'en',
  'Kettlebell clean and press',
  'kettlebell clean press',
  '[
    "Stand with kettlebell between feet.",
    "Hip hinge and grip kettlebell with one hand.",
    "Extend hips bringing kettlebell to shoulder (clean).",
    "Catch kettlebell in rack position on forearm.",
    "Press kettlebell overhead extending arm.",
    "Lower to rack position then to floor for next rep."
  ]',
  '[
    "Banging wrist in clean due to poor technique",
    "Not rotating kettlebell properly in rack",
    "Pressing without stabilizing in rack first",
    "Not using hip extension in clean"
  ]'
);

-- ==================== BODYWEIGHT ====================

-- 11. Burpee
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '80000000-0001-0000-0000-000000000011',
  'en',
  'Burpee',
  'burpee full body cardio calisthenics',
  '[
    "Stand with feet shoulder-width apart.",
    "Squat down and place hands on floor.",
    "Jump feet back into plank position.",
    "Perform a push-up (optional).",
    "Jump feet forward toward hands.",
    "Jump up extending arms overhead."
  ]',
  '[
    "Not reaching full plank position",
    "Letting hips sag in plank",
    "Not completing vertical jump",
    "Performing movement in uncoordinated manner"
  ]'
);
