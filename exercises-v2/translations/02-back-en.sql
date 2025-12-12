-- =============================================
-- BACK EXERCISES - ENGLISH TRANSLATIONS
-- =============================================

-- 1. Pull-ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000001',
  'en',
  'Pull-ups',
  'pull ups pullups bar grip back lats dorsals',
  '[
    "Hang from the bar with a pronated grip (palms facing away), hands slightly wider than shoulder-width.",
    "Engage your lats and initiate the movement by retracting your shoulder blades down and back.",
    "Pull your body upward, driving your elbows toward your ribs.",
    "Rise until your chin clears the bar or your chest touches it.",
    "Lower yourself in a controlled manner, fully extending your arms before the next rep."
  ]',
  '[
    "Using momentum or swinging instead of controlled strength",
    "Not lowering fully and doing partial reps",
    "Pulling only with arms without engaging lats",
    "Crossing legs and excessively arching lower back"
  ]'
);

-- 2. Assisted pull-ups (machine)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000002',
  'en',
  'Assisted pull-ups',
  'assisted pull ups machine pulldown back lats dorsals',
  '[
    "Adjust the assistance weight according to your level (more weight = more help).",
    "Kneel or stand on the assistance platform and grip the upper handles.",
    "Engage your lats by retracting your shoulder blades before pulling.",
    "Pull your body upward, driving your elbows toward your ribs.",
    "Lower in a controlled manner to full arm extension."
  ]',
  '[
    "Using too much assistance, not progressing toward free pull-ups",
    "Pushing off with legs on the platform",
    "Performing the movement too fast without control",
    "Not fully extending arms at the bottom"
  ]'
);

-- 3. Lat pulldown
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000003',
  'en',
  'Lat pulldown',
  'lat pulldown cable machine back lats dorsals pulldown',
  '[
    "Sit at the machine and adjust the thigh pads to secure yourself.",
    "Grip the bar with a pronated grip, slightly wider than shoulder-width.",
    "Lean your torso slightly back (about 15-20 degrees) and push your chest out.",
    "Pull the bar toward your upper chest, driving your elbows down and back.",
    "Squeeze your lats at the contraction, then let the bar rise in a controlled manner."
  ]',
  '[
    "Pulling the bar behind the neck, stressing the shoulders",
    "Leaning too far back using momentum",
    "Pulling mainly with biceps instead of lats",
    "Not controlling the eccentric phase, letting the weight rise fast"
  ]'
);

-- 4. Close grip lat pulldown
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000004',
  'en',
  'Close grip lat pulldown',
  'close grip lat pulldown cable back lats dorsals neutral',
  '[
    "Sit and secure your thighs under the pads.",
    "Use a close grip or V-bar attachment with palms facing each other (neutral grip).",
    "Lean your torso slightly back and push your chest out.",
    "Pull the attachment toward your sternum, squeezing your elbows against your body.",
    "Control the ascent, fully stretching your lats at the top."
  ]',
  '[
    "Using too much weight sacrificing range of motion",
    "Rounding shoulders forward",
    "Not driving elbows far enough back",
    "Performing the movement too fast losing tension"
  ]'
);

-- 5. Barbell row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000005',
  'en',
  'Barbell row',
  'barbell row bent over row back lats dorsals',
  '[
    "Stand with feet shoulder-width apart, grip the barbell with a pronated grip.",
    "Slightly bend your knees and hinge your torso forward (about 45-60 degrees).",
    "Keep your back straight and core engaged throughout the movement.",
    "Pull the barbell toward your lower abdomen, driving your elbows back close to your body.",
    "Lower the barbell in a controlled manner without rounding your back."
  ]',
  '[
    "Rounding the lower back, risking lumbar injury",
    "Standing too upright, turning the exercise into a shrug",
    "Using hip momentum to lift the weight",
    "Pulling the bar toward the chest instead of the abdomen"
  ]'
);

-- 6. One-arm dumbbell row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000006',
  'en',
  'One-arm dumbbell row',
  'one arm dumbbell row single arm back lats dorsals unilateral',
  '[
    "Place one hand and the same-side knee on a flat bench.",
    "Keep your back parallel to the floor and core engaged.",
    "With your free hand, grab the dumbbell from the floor.",
    "Pull the dumbbell toward your hip, driving your elbow up and back.",
    "Lower in a controlled manner, fully stretching your lat at the bottom."
  ]',
  '[
    "Rotating the torso excessively while pulling",
    "Not fully extending the arm at the bottom",
    "Pulling toward the shoulder instead of toward the hip",
    "Dropping the dumbbell instead of lowering it controlled"
  ]'
);

-- 7. Machine row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000007',
  'en',
  'Machine row',
  'machine row seated row back lats dorsals',
  '[
    "Adjust the seat so the handles are at chest height.",
    "Sit with your chest against the support pad and grip the handles.",
    "Pull the handles toward your torso, squeezing your shoulder blades together.",
    "Keep your elbows close to your body during the pull.",
    "Return to the starting position in a controlled manner."
  ]',
  '[
    "Lifting chest off the support to use momentum",
    "Shrugging shoulders instead of retracting shoulder blades",
    "Using only arms without engaging the back",
    "Releasing the weight quickly without control"
  ]'
);

-- 8. Seated cable row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000008',
  'en',
  'Seated cable row',
  'seated cable row low pulley back lats dorsals',
  '[
    "Sit facing the pulley with feet on the supports and knees slightly bent.",
    "Grip the attachment (V-bar or straight bar) with arms extended.",
    "Keep your torso upright and push your chest out.",
    "Pull the attachment toward your abdomen, squeezing your shoulder blades.",
    "Extend your arms in a controlled manner, feeling the stretch in your lats."
  ]',
  '[
    "Swinging the torso back and forth",
    "Rounding the back during extension",
    "Pulling only with arms without using the back",
    "Hunching shoulders forward"
  ]'
);

-- 9. T-Bar row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000009',
  'en',
  'T-Bar row',
  't-bar row tbar landmine back lats dorsals',
  '[
    "Place one end of the barbell in a corner or landmine attachment.",
    "Load plates on the other end and use a V-grip or grip the bar directly.",
    "Straddle the bar with legs on each side, hinge your torso forward.",
    "Pull the weight toward your abdomen, keeping elbows close to your body.",
    "Lower in a controlled manner while keeping your back straight."
  ]',
  '[
    "Rounding the lower back during the movement",
    "Standing too upright losing the position",
    "Using excessive hip momentum",
    "Not controlling the lowering of the weight"
  ]'
);

-- 10. Dumbbell pullover
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000010',
  'en',
  'Dumbbell pullover',
  'dumbbell pullover back lats chest pecs',
  '[
    "Lie perpendicular across a bench, supporting only your upper back.",
    "Hold the dumbbell with both hands under the upper plate, arms extended over your chest.",
    "Lower the dumbbell behind your head in an arc, keeping elbows slightly bent.",
    "Feel the stretch in your lats and chest.",
    "Raise the dumbbell back to start, contracting lats and pecs."
  ]',
  '[
    "Bending elbows too much, turning the movement into a triceps extension",
    "Dropping hips during the movement",
    "Not lowering enough to stretch the muscles",
    "Using too much weight losing control"
  ]'
);

-- 11. Cable pullover
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000011',
  'en',
  'Cable pullover',
  'cable pullover straight arm pulldown back lats',
  '[
    "Stand facing a high pulley with a straight bar or rope attachment.",
    "Grip the bar with arms extended overhead.",
    "With elbows slightly bent, pull the bar down in an arc toward your thighs.",
    "Keep your core engaged and avoid bending your elbows more during the movement.",
    "Return to the top in a controlled manner, feeling the stretch."
  ]',
  '[
    "Bending elbows excessively, using triceps",
    "Leaning forward too much",
    "Not using full range of motion",
    "Using momentum instead of muscle contraction"
  ]'
);

-- 12. Barbell upright row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000012',
  'en',
  'Barbell upright row',
  'barbell upright row traps upper back shoulders',
  '[
    "Stand with feet shoulder-width apart, grip the barbell with a narrow pronated grip.",
    "Let the barbell hang in front of your thighs with arms extended.",
    "Pull the barbell upward close to your body, driving your elbows out and up.",
    "Rise until the barbell reaches chin height or elbows exceed shoulder height.",
    "Lower in a controlled manner to the starting position."
  ]',
  '[
    "Raising the bar too high causing shoulder impingement",
    "Using a grip too narrow increasing wrist and shoulder stress",
    "Swinging the body to generate momentum",
    "Hunching shoulders forward"
  ]'
);

-- 13. Dumbbell upright row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000013',
  'en',
  'Dumbbell upright row',
  'dumbbell upright row traps upper back shoulders',
  '[
    "Stand with a dumbbell in each hand, palms facing your body.",
    "Let the dumbbells hang in front of your thighs.",
    "Pull the dumbbells upward, driving your elbows out.",
    "Rise until your elbows exceed shoulder height.",
    "Lower in a controlled manner back to the starting position."
  ]',
  '[
    "Raising shoulders excessively (shrugging)",
    "Using momentum by swinging the body",
    "Raising dumbbells too high stressing shoulders",
    "Not keeping dumbbells close to the body"
  ]'
);

-- 14. Barbell shrugs
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000014',
  'en',
  'Barbell shrugs',
  'barbell shrugs traps upper back trapezius',
  '[
    "Stand with feet shoulder-width apart, grip the barbell with a pronated grip at shoulder width.",
    "Let the barbell hang with arms extended in front of your thighs.",
    "Elevate your shoulders toward your ears in a straight line, without rotating.",
    "Hold the contraction at the top for a second.",
    "Lower your shoulders in a controlled manner to the starting position."
  ]',
  '[
    "Rotating shoulders (forward or backward) instead of lifting straight",
    "Bending elbows to help lift",
    "Using too much weight with limited range of motion",
    "Moving head forward during the movement"
  ]'
);

-- 15. Dumbbell shrugs
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000015',
  'en',
  'Dumbbell shrugs',
  'dumbbell shrugs traps upper back trapezius',
  '[
    "Stand with a dumbbell in each hand at your sides, palms facing your body.",
    "Keep arms extended and core engaged.",
    "Elevate your shoulders toward your ears without bending your elbows.",
    "Squeeze your traps at the top and hold briefly.",
    "Lower your shoulders in a controlled manner."
  ]',
  '[
    "Using dumbbells too heavy with incomplete range",
    "Leaning torso forward or backward",
    "Rotating shoulders in circles",
    "Bending elbows to assist the movement"
  ]'
);

-- 16. Machine shrugs
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000016',
  'en',
  'Machine shrugs',
  'machine shrugs traps upper back trapezius',
  '[
    "Adjust the machine so handles are at hand height with arms extended.",
    "Stand between the handles and grip them with a neutral grip.",
    "Keep your torso upright and arms extended.",
    "Elevate your shoulders toward your ears, contracting your traps.",
    "Lower in a controlled manner to the starting position."
  ]',
  '[
    "Using knee momentum to lift",
    "Not using full range of motion",
    "Leaning body forward",
    "Rushing through reps without control"
  ]'
);

-- 17. Face pull
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000017',
  'en',
  'Face pull',
  'face pull cable rope upper back rear delts rotator cuff',
  '[
    "Set the cable pulley at face height with a rope attachment.",
    "Grip the rope with both hands, palms facing each other.",
    "Step back to create tension with arms extended.",
    "Pull the rope toward your face, separating the ends and driving elbows out and back.",
    "Finish with hands beside your face and shoulder blades squeezed, then return controlled."
  ]',
  '[
    "Using too much weight losing form",
    "Not separating the rope at the end of the movement",
    "Pulling toward chest instead of face",
    "Leaning back using body momentum"
  ]'
);

-- 18. Inverted row
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes) VALUES (
  '40000000-0001-0000-0000-000000000018',
  'en',
  'Inverted row',
  'inverted row australian pull up bodyweight back calisthenics',
  '[
    "Set a bar at hip height in a rack or Smith machine.",
    "Lie underneath the bar and grip it with a pronated grip, slightly wider than shoulder-width.",
    "Extend your body forming a straight line from head to heels.",
    "Pull your chest toward the bar, squeezing your shoulder blades.",
    "Lower in a controlled manner to full arm extension."
  ]',
  '[
    "Letting hips sag, losing the straight body line",
    "Not pulling high enough to touch bar with chest",
    "Using hip momentum to pull up",
    "Hyperextending neck by looking up"
  ]'
);

