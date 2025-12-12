-- =============================================
-- CHEST EXERCISES - ENGLISH TRANSLATIONS
-- =============================================

-- 1. Barbell Bench Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000001',
  'en',
  'Barbell Bench Press',
  'barbell bench press chest flat pectorals',
  '[
    "Lie on the bench with your eyes under the bar.",
    "Grip the bar slightly wider than shoulder-width apart.",
    "Retract your shoulder blades and slightly arch your lower back, keeping glutes on the bench.",
    "Unrack the bar and position it over your chest with arms extended.",
    "Lower the bar in a controlled manner until it touches your chest (nipple line).",
    "Push the bar up and slightly back to the starting position.",
    "Keep your feet firmly planted on the floor throughout the movement."
  ]',
  '["Bouncing the bar off chest", "Lifting glutes off the bench", "Wrists bent backwards", "Not retracting shoulder blades"]'
);

-- 2. Dumbbell Bench Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000002',
  'en',
  'Dumbbell Bench Press',
  'dumbbell bench press chest flat pectorals db',
  '[
    "Sit on the bench with dumbbells on your thighs.",
    "Lie back while bringing the dumbbells to your chest in a controlled motion.",
    "Position the dumbbells at the sides of your chest, elbows at 45° from your body.",
    "Push the dumbbells up until your arms are extended.",
    "Lower in a controlled manner until your elbows are at bench level.",
    "Keep your wrists neutral and shoulders retracted throughout the movement."
  ]',
  '["Lowering dumbbells too far", "Clanking dumbbells together at top", "Losing lower back arch", "Elbows flared out at 90°"]'
);

-- 3. Smith Machine Bench Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000003',
  'en',
  'Smith Machine Bench Press',
  'smith machine bench press chest flat guided',
  '[
    "Position the bench under the Smith machine bar.",
    "Lie down so the bar is over your nipple line.",
    "Grip the bar slightly wider than shoulder-width.",
    "Unlock the bar by rotating your wrists and lower it to your chest.",
    "Push up until your arms are fully extended.",
    "Lock the bar on the hooks by rotating your wrists when finishing the set."
  ]',
  '["Incorrect bench position relative to bar", "Not locking safety catches properly", "Bouncing bar off chest"]'
);

-- 4. Machine Chest Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000004',
  'en',
  'Machine Chest Press',
  'machine chest press pectorals seated',
  '[
    "Adjust the seat so the handles are at chest height.",
    "Sit with your back against the pad.",
    "Grip the handles and push forward until your arms are extended.",
    "Return in a controlled manner without letting the plates slam.",
    "Keep your shoulders down and chest up throughout the movement."
  ]',
  '["Seat too high or too low", "Letting weight slam down", "Not completing full range of motion"]'
);

-- 5. Incline Barbell Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000005',
  'en',
  'Incline Barbell Press',
  'incline barbell bench press chest upper pectorals',
  '[
    "Adjust the bench to a 30-45 degree incline.",
    "Lie down with your eyes under the bar.",
    "Grip the bar slightly wider than shoulder-width.",
    "Unrack the bar and position it over your upper chest.",
    "Lower the bar in a controlled manner to touch your upper chest.",
    "Push up until your arms are fully extended.",
    "Keep your glutes on the bench throughout the movement."
  ]',
  '["Too much incline (over 45°)", "Lowering bar to neck instead of upper chest", "Lifting glutes off bench"]'
);

-- 6. Incline Dumbbell Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000006',
  'en',
  'Incline Dumbbell Press',
  'incline dumbbell press chest upper pectorals db',
  '[
    "Adjust the bench to a 30-45 degree incline.",
    "Sit with dumbbells on your thighs and lie back bringing them to your chest.",
    "Position the dumbbells at the sides of your upper chest, elbows at 45°.",
    "Push the dumbbells up until your arms are extended.",
    "Lower in a controlled manner until your elbows are at bench level.",
    "Maintain scapular retraction throughout the movement."
  ]',
  '["Too much bench incline", "Elbows flared too wide", "Losing scapular retraction", "Excessive back arch"]'
);

-- 7. Decline Barbell Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000007',
  'en',
  'Decline Barbell Press',
  'decline barbell bench press chest lower pectorals',
  '[
    "Adjust the bench to a decline position and secure your feet in the supports.",
    "Lie down and grip the bar slightly wider than shoulder-width.",
    "Unrack the bar and position it over your lower chest.",
    "Lower the bar in a controlled manner to touch your lower chest.",
    "Push up until your arms are extended.",
    "Carefully rack the bar when finished."
  ]',
  '["Not securing feet properly", "Lowering bar too high (toward neck)", "Losing control when racking"]'
);

-- 8. Decline Dumbbell Press
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000008',
  'en',
  'Decline Dumbbell Press',
  'decline dumbbell press chest lower pectorals db',
  '[
    "Adjust the bench to a decline position and secure your feet.",
    "Ask for help to receive the dumbbells or carefully bring them as you lie down.",
    "Position the dumbbells at the sides of your lower chest.",
    "Push the dumbbells up until your arms are extended.",
    "Lower in a controlled manner keeping elbows at 45° from your body.",
    "Carefully set down the dumbbells when finished or ask for assistance."
  ]',
  '["Not securing feet properly", "Dropping dumbbells abruptly", "Elbows flared too wide"]'
);

-- 9. Dumbbell Flyes
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000009',
  'en',
  'Dumbbell Flyes',
  'dumbbell flyes fly chest pectorals opening',
  '[
    "Lie on the bench with a dumbbell in each hand.",
    "Extend your arms over your chest with palms facing each other.",
    "Maintain a slight bend in your elbows throughout the movement.",
    "Open your arms to the sides in a controlled manner until you feel a stretch in your chest.",
    "Contract your chest to bring the dumbbells back together at the top.",
    "Imagine you are hugging a large tree."
  ]',
  '["Arms too straight (locked elbows)", "Going too deep and straining shoulders", "Turning movement into a press"]'
);

-- 10. Cable Crossover
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000010',
  'en',
  'Cable Crossover',
  'cable crossover fly chest pectorals cables',
  '[
    "Set the pulleys in the high position and grab a handle in each hand.",
    "Step forward and position yourself with your torso slightly leaning forward.",
    "With arms open and elbows slightly bent, pull forward.",
    "Bring your hands together in front of your chest, crossing them slightly.",
    "Return in a controlled manner to the starting position feeling the stretch.",
    "Keep your core engaged to stabilize your body."
  ]',
  '["Using too much weight and losing form", "Not controlling the eccentric phase", "Leaning too far forward"]'
);

-- 11. Pec Deck Machine
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000011',
  'en',
  'Pec Deck Machine',
  'pec deck machine fly chest pectorals butterfly',
  '[
    "Adjust the seat so your arms are parallel to the floor.",
    "Sit with your back against the pad and grip the handles or rest your forearms.",
    "Bring your arms together in front of your chest by contracting your pectorals.",
    "Hold the contraction for a second at the end point.",
    "Return in a controlled manner without dropping the weight.",
    "Keep your shoulders down and chest elevated."
  ]',
  '["Poorly adjusted seat", "Shrugging shoulders", "Letting weight drop", "Not completing full range of motion"]'
);

-- 12. Push-Ups
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000012',
  'en',
  'Push-Ups',
  'push ups pushups chest arms bodyweight',
  '[
    "Get in a plank position with hands slightly wider than shoulders.",
    "Keep your body in a straight line from head to heels.",
    "Lower your chest toward the floor by bending your elbows at 45° from your body.",
    "Lower until your chest almost touches the floor.",
    "Push up until your arms are fully extended.",
    "Keep your core engaged and glutes tight throughout the movement."
  ]',
  '["Sagging or elevated hips", "Elbows flared at 90°", "Not going low enough", "Head dropping"]'
);

-- 13. Incline Push-Ups (Hands Elevated)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000013',
  'en',
  'Incline Push-Ups (Hands Elevated)',
  'incline push ups pushups easy beginner hands elevated',
  '[
    "Place your hands on an elevated surface (bench, step, wall).",
    "Position yourself in a straight line from head to heels.",
    "Lower your chest toward the surface by bending your elbows.",
    "Keep your elbows at 45° from your body during the descent.",
    "Push up until your arms are extended.",
    "The higher the surface, the easier the exercise."
  ]',
  '["Sagging hips", "Not keeping body straight", "Elbows flared too wide"]'
);

-- 14. Decline Push-Ups (Feet Elevated)
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000014',
  'en',
  'Decline Push-Ups (Feet Elevated)',
  'decline push ups pushups advanced feet elevated upper chest',
  '[
    "Place your feet on an elevated surface (bench, chair, step).",
    "Position your hands on the floor slightly wider than shoulders.",
    "Keep your body in a straight line, engaging your core.",
    "Lower your chest toward the floor in a controlled manner.",
    "Push up until your arms are extended.",
    "The higher the surface, the greater the emphasis on upper chest."
  ]',
  '["Hips too elevated", "Losing straight body line", "Not going low enough"]'
);

-- 15. Chest Dips
INSERT INTO exercise_translations (exercise_id, language_code, name, name_search, instructions, common_mistakes)
VALUES (
  '10000000-0001-0000-0000-000000000015',
  'en',
  'Chest Dips',
  'chest dips parallel bars pectorals bodyweight',
  '[
    "Grip the parallel bars and lift your body with arms extended.",
    "Lean your torso forward (about 30°) to emphasize the chest.",
    "Cross your feet behind and slightly bend your knees.",
    "Lower your body by bending your elbows until your arms form 90° or less.",
    "Keep your elbows pointing slightly outward.",
    "Push up until your arms are extended without fully locking out.",
    "Control the movement, avoiding swinging."
  ]',
  '["Going too deep and straining shoulders", "Not leaning forward (works more triceps)", "Swinging", "Elbows too wide"]'
);
