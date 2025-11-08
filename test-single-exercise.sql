-- Test de UN SOLO ejercicio para validar la estructura
-- Ejercicio: Press de banca con barra

INSERT INTO exercises (
    id,
    name,
    source,
    created_by_user_id,
    main_muscle_group,
    primary_equipment,
    exercise_type,
    secondary_muscle_groups,
    instructions,
    equipment,
    similar_exercises,
    default_measurement_template
) VALUES (
    gen_random_uuid(),
    'Press de banca con barra',
    'system',
    null,
    'chest_middle',
    'barbell',
    'compound',
    '["chest_upper", "front_delts", "triceps"]'::jsonb,
    '["Acostate boca arriba en un banco plano con los pies firmemente apoyados en el suelo", "Agarrá la barra con un agarre pronado, un poco más ancho que los hombros", "Bajá la barra controladamente hasta tocar el pecho, mantendo los codos a 45°", "Empujá la barra hacia arriba hasta extensión completa de los brazos", "Mantené la espalda neutra y el core activo durante todo el movimiento"]'::jsonb,
    '["barbell", "flat_bench", "weight_plate"]'::jsonb,
    '[]'::jsonb,
    'weight_reps'
);