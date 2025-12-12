-- =============================================
-- LEG EXERCISES - ENGLISH TRANSLATIONS
-- =============================================

-- ==================== QUADS ====================

-- 1. Back squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000001',
  'en',
  'Barbell back squat',
  'barbell back squat quads legs',
  '[
    "Place the bar on your upper traps (high bar) or rear delts (low bar).",
    "Stand with feet shoulder-width apart or slightly wider, toes slightly pointed out.",
    "Engage your core, push chest out, and keep gaze forward.",
    "Lower by bending hips and knees, as if sitting into a chair.",
    "Descend until thighs are parallel or below, then drive through heels to stand."
  ]',
  '[
    "Letting knees cave inward",
    "Rounding lower back (lumbar flexion)",
    "Lifting heels off the floor",
    "Leaning torso excessively forward"
  ]'
);

-- 2. Front squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000002',
  'en',
  'Front squat',
  'front squat quads legs barbell',
  '[
    "Place bar on front delts, using either crossed arms or clean grip.",
    "Keep elbows high so the bar does not roll forward.",
    "Stand with feet shoulder-width apart.",
    "Lower while keeping torso as vertical as possible.",
    "Drive through heels to stand."
  ]',
  '[
    "Letting elbows drop, causing bar to roll",
    "Leaning forward and losing the bar",
    "Not having enough wrist or ankle mobility",
    "Letting knees cave inward"
  ]'
);

-- 3. Smith machine squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000003',
  'en',
  'Smith machine squat',
  'smith machine squat quads legs',
  '[
    "Position bar on traps and unrack by rotating.",
    "Feet can be slightly in front of the bar.",
    "Lower in a controlled manner to parallel or below.",
    "Push up without fully locking out knees.",
    "When finished, rotate bar to engage the safety hooks."
  ]',
  '[
    "Placing feet too far forward stressing lower back",
    "Aggressively locking out knees at top",
    "Not reaching sufficient depth",
    "Relying only on Smith without doing free squats"
  ]'
);

-- 4. Hack squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000004',
  'en',
  'Hack squat',
  'hack squat machine quads legs',
  '[
    "Position back against pad and shoulders under the shoulder pads.",
    "Place feet on platform at shoulder-width.",
    "Release safety handles and lower by bending knees.",
    "Descend until thighs are parallel or below.",
    "Push up without fully locking out knees."
  ]',
  '[
    "Placing feet too high or low on the platform",
    "Lifting lower back off the pad",
    "Aggressively locking knees",
    "Using too much weight with limited range"
  ]'
);

-- 5. Leg press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000005',
  'en',
  'Leg press',
  'leg press machine quads legs',
  '[
    "Sit in the machine with back and glutes firmly against the pad.",
    "Place feet on platform at shoulder-width.",
    "Release safety handles and lower platform by bending knees.",
    "Lower until knees form 90 degrees without glutes lifting.",
    "Push up without fully locking out knees."
  ]',
  '[
    "Lifting glutes off seat when lowering too far",
    "Aggressively locking knees at top",
    "Placing feet too close together or too wide",
    "Using too much weight with very short range"
  ]'
);

-- 6. Leg extension
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000006',
  'en',
  'Leg extension',
  'leg extension machine quads legs',
  '[
    "Adjust backrest so knees align with the rotation axis.",
    "Place ankles behind the padded roller.",
    "Hold the side handles to stabilize yourself.",
    "Extend knees lifting the weight to full extension.",
    "Lower in a controlled manner without releasing tension."
  ]',
  '[
    "Using momentum by swinging torso",
    "Not fully extending knees",
    "Lowering weight too fast",
    "Having knees misaligned with the machine"
  ]'
);

-- 7. Dumbbell lunges
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000007',
  'en',
  'Dumbbell lunges',
  'dumbbell lunges quads glutes legs',
  '[
    "Stand with a dumbbell in each hand at your sides.",
    "Take a long step forward with one leg.",
    "Lower until both knees form approximately 90 degrees.",
    "Back knee nearly touches the floor.",
    "Push through front leg to return and repeat with other leg."
  ]',
  '[
    "Taking too short a step stressing the knee",
    "Letting front knee go past the toe",
    "Leaning torso forward",
    "Losing balance due to step being too long"
  ]'
);

-- 8. Barbell lunges
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000008',
  'en',
  'Barbell lunges',
  'barbell lunges quads glutes legs',
  '[
    "Place bar on traps as in a squat.",
    "Take a long step forward while maintaining balance.",
    "Lower until both knees form 90 degrees.",
    "Keep torso upright and core engaged.",
    "Push through front leg to return and repeat alternating."
  ]',
  '[
    "Losing balance with the bar",
    "Leaning forward excessively",
    "Taking too short steps",
    "Not lowering to sufficient depth"
  ]'
);

-- 9. Bulgarian split squat
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000009',
  'en',
  'Bulgarian split squat',
  'bulgarian split squat quads glutes legs',
  '[
    "Place the top of rear foot on a bench behind you.",
    "Front foot is about one step away from the bench.",
    "Hold dumbbells at sides or a barbell on back.",
    "Lower by bending front knee to 90 degrees.",
    "Drive through front heel to stand."
  ]',
  '[
    "Placing front foot too close to the bench",
    "Letting knee collapse inward",
    "Leaning torso excessively forward",
    "Not lowering to sufficient depth"
  ]'
);

-- ==================== HAMSTRINGS ====================

-- 10. Romanian deadlift
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000010',
  'en',
  'Romanian deadlift',
  'romanian deadlift rdl hamstrings legs',
  '[
    "Stand with feet hip-width apart, holding barbell in front of thighs.",
    "Keep knees slightly bent throughout the movement.",
    "Push hips back while lowering bar along legs.",
    "Lower until you feel a stretch in hamstrings, keeping back straight.",
    "Contract glutes and drive hips forward to stand."
  ]',
  '[
    "Rounding the back during descent",
    "Bending knees too much (it is not a squat)",
    "Lowering bar away from legs",
    "Not feeling stretch in hamstrings"
  ]'
);

-- 11. Dumbbell Romanian deadlift
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000011',
  'en',
  'Dumbbell Romanian deadlift',
  'dumbbell romanian deadlift rdl hamstrings legs',
  '[
    "Stand with feet hip-width apart, dumbbells in front of thighs.",
    "Keep knees slightly bent.",
    "Push hips back while lowering dumbbells along legs.",
    "Keep back straight and core engaged.",
    "Stand by contracting glutes and driving hips forward."
  ]',
  '[
    "Rounding lower back",
    "Letting dumbbells drift away from body",
    "Not keeping knees slightly bent",
    "Rising using lower back instead of glutes"
  ]'
);

-- 12. Single-leg Romanian deadlift
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000012',
  'en',
  'Single-leg Romanian deadlift',
  'single leg romanian deadlift rdl hamstrings legs unilateral',
  '[
    "Stand on one leg holding a dumbbell in the opposite hand.",
    "Keep a slight bend in the standing knee.",
    "Hinge torso forward while free leg extends back.",
    "Form a straight line from head to back foot.",
    "Return to standing by contracting glutes and hamstrings."
  ]',
  '[
    "Losing balance due to lack of stability",
    "Rotating hip instead of keeping it square",
    "Rounding the back",
    "Not lowering enough to stretch hamstrings"
  ]'
);

-- 13. Lying leg curl
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000013',
  'en',
  'Lying leg curl',
  'lying leg curl hamstrings machine legs',
  '[
    "Lie face down on machine with ankles under the roller.",
    "Adjust machine so knees are just at the edge of the bench.",
    "Grip handles to stabilize yourself.",
    "Curl heels toward glutes by flexing knees.",
    "Lower in a controlled manner without releasing tension."
  ]',
  '[
    "Lifting hips off bench to help",
    "Using momentum to lift weight",
    "Not controlling lowering phase",
    "Having knees poorly positioned on bench"
  ]'
);

-- 14. Seated leg curl
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000014',
  'en',
  'Seated leg curl',
  'seated leg curl hamstrings machine legs',
  '[
    "Sit with back against pad and legs extended.",
    "Place ankles over upper roller and thighs under lower pad.",
    "Curl heels down and back by flexing knees.",
    "Squeeze hamstrings at maximum contraction.",
    "Extend legs in a controlled manner."
  ]',
  '[
    "Leaning forward to assist movement",
    "Not using full range of motion",
    "Releasing weight quickly on extension",
    "Using too much weight with poor form"
  ]'
);

-- 15. Good mornings
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000015',
  'en',
  'Good mornings',
  'good mornings hamstrings glutes lower back legs',
  '[
    "Place bar on traps as in a squat.",
    "Stand with feet shoulder-width apart, knees slightly bent.",
    "Keep back straight and hinge forward from the hips.",
    "Lower until you feel a stretch in hamstrings.",
    "Return up by contracting glutes and hamstrings."
  ]',
  '[
    "Rounding lower back",
    "Using too much weight before mastering technique",
    "Locking knees completely",
    "Lowering too far losing neutral spine"
  ]'
);

-- ==================== GLUTES ====================

-- 16. Barbell hip thrust
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000016',
  'en',
  'Barbell hip thrust',
  'barbell hip thrust glutes legs hips',
  '[
    "Sit on floor with upper back against a bench.",
    "Place barbell across hips with a pad to protect the bone.",
    "Feet are planted on floor, knees bent.",
    "Drive hips up until torso is parallel to floor.",
    "Squeeze glutes at top and lower in a controlled manner."
  ]',
  '[
    "Hyperextending lower back at top",
    "Not rising enough to full hip extension",
    "Pushing with feet instead of engaging glutes",
    "Placing feet too close or too far"
  ]'
);

-- 17. Machine hip thrust
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000017',
  'en',
  'Machine hip thrust',
  'machine hip thrust glutes legs',
  '[
    "Adjust machine and sit with back against pad.",
    "Place feet on platform at hip-width.",
    "Drive hips up extending completely.",
    "Squeeze glutes at maximum contraction.",
    "Lower in a controlled manner without releasing tension."
  ]',
  '[
    "Not fully extending hips at top",
    "Using too much weight with limited range",
    "Not squeezing glutes at contraction",
    "Poor foot placement on platform"
  ]'
);

-- 18. Glute bridge
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000018',
  'en',
  'Glute bridge',
  'glute bridge floor legs bodyweight',
  '[
    "Lie face up with knees bent and feet planted.",
    "Arms rest at your sides.",
    "Drive hips up by squeezing glutes.",
    "Form a straight line from shoulders to knees at top.",
    "Lower in a controlled manner and repeat."
  ]',
  '[
    "Hyperextending lower back at top",
    "Not squeezing glutes at contraction",
    "Pushing mainly with hamstrings",
    "Placing feet too far from body"
  ]'
);

-- 19. Cable glute kickback
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000019',
  'en',
  'Cable glute kickback',
  'cable glute kickback glutes legs',
  '[
    "Attach ankle strap to a low pulley.",
    "Stand facing machine, holding on for balance.",
    "Keep working leg slightly bent.",
    "Extend hip by driving leg backward.",
    "Squeeze glute at top and return controlled."
  ]',
  '[
    "Arching lower back to lift leg higher",
    "Using momentum instead of muscle contraction",
    "Not controlling the lowering phase",
    "Rotating hip instead of keeping it square"
  ]'
);

-- 20. Machine glute kickback
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000020',
  'en',
  'Machine glute kickback',
  'machine glute kickback glutes legs',
  '[
    "Adjust machine and place foot on platform.",
    "Rest forearms on the supports.",
    "Push platform back by extending hip.",
    "Squeeze glute at maximum extension.",
    "Return controlled without releasing tension."
  ]',
  '[
    "Arching lower back excessively",
    "Not fully extending hip",
    "Using too much weight losing control",
    "Performing movement too fast"
  ]'
);

-- 21. Hip abduction machine
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000021',
  'en',
  'Hip abduction machine',
  'hip abduction machine glutes legs',
  '[
    "Sit with back against pad and legs together.",
    "Outer thighs rest against the pads.",
    "Open legs outward against the resistance.",
    "Squeeze glutes at maximum opening.",
    "Return controlled without letting weights slam."
  ]',
  '[
    "Leaning forward to help",
    "Not using full range of motion",
    "Letting legs return without control",
    "Using too much weight with poor form"
  ]'
);

-- ==================== CALVES ====================

-- 22. Standing calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000022',
  'en',
  'Standing calf raise',
  'standing calf raise calves legs',
  '[
    "Stand in machine with shoulders under pads.",
    "Place balls of feet on platform edge.",
    "Heels hang below platform level.",
    "Raise heels by rising onto balls of feet.",
    "Lower in a controlled manner, stretching calves."
  ]',
  '[
    "Not lowering heels enough for a stretch",
    "Bending knees to assist movement",
    "Performing movement too fast without control",
    "Using too much weight with limited range"
  ]'
);

-- 23. Seated calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000023',
  'en',
  'Seated calf raise',
  'seated calf raise calves legs soleus',
  '[
    "Sit in machine with knees under pads.",
    "Place balls of feet on platform edge.",
    "Release safety and lower heels to stretch.",
    "Raise heels by contracting calves.",
    "Hold contraction at top and lower controlled."
  ]',
  '[
    "Not using full range of motion",
    "Bouncing at bottom instead of controlled stretch",
    "Using too much weight sacrificing technique",
    "Performing movement too fast"
  ]'
);

-- 24. Leg press calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000024',
  'en',
  'Leg press calf raise',
  'leg press calf raise calves legs',
  '[
    "Sit in leg press with only balls of feet on platform.",
    "Extend legs almost completely (without locking knees).",
    "Push platform with balls of feet.",
    "Lower heels stretching calves.",
    "Rise onto balls of feet contracting calves."
  ]',
  '[
    "Bending knees during movement",
    "Not fully stretching calves at bottom",
    "Using too much weight with very short range",
    "Locking knees during exercise"
  ]'
);

-- 25. Single-leg dumbbell calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000025',
  'en',
  'Single-leg dumbbell calf raise',
  'single leg dumbbell calf raise calves legs',
  '[
    "Stand on one leg on a step, holding a dumbbell.",
    "Use other hand to balance against a wall.",
    "Lower heel below step level.",
    "Raise heel by rising onto ball of foot.",
    "Complete reps and switch legs."
  ]',
  '[
    "Not using full range of motion",
    "Using momentum instead of muscle contraction",
    "Bending knee to help",
    "Losing balance due to lack of support"
  ]'
);

-- 26. Smith machine calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000026',
  'en',
  'Smith machine calf raise',
  'smith machine calf raise calves legs',
  '[
    "Place a step or plates under the Smith bar.",
    "Stand with shoulders under bar and balls of feet on step.",
    "Unrack bar and lower heels.",
    "Raise heels by rising onto balls of feet.",
    "Lower in a controlled manner stretching calves."
  ]',
  '[
    "Not using enough range of motion",
    "Bending knees to help",
    "Losing balance due to poor positioning",
    "Performing movement too fast"
  ]'
);

-- 27. Donkey calf raise
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '70000000-0001-0000-0000-000000000027',
  'en',
  'Donkey calf raise',
  'donkey calf raise calves legs',
  '[
    "Lean forward and place forearms on support.",
    "Position hips under machine pad.",
    "Place balls of feet on platform edge.",
    "Lower heels stretching calves.",
    "Raise heels by maximally contracting calves."
  ]',
  '[
    "Rounding back during movement",
    "Not using full range of motion",
    "Using legs to generate momentum",
    "Performing movement too fast"
  ]'
);
