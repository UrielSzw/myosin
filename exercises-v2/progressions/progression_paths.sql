-- =============================================
-- PROGRESSION PATHS DEFINITION
-- Defines the skill trees for calisthenics progressions
-- =============================================

-- Schema reminder:
-- progression_paths: id, slug, name_en, name_es, description_en, description_es, category, difficulty_tier, icon

-- Categories: 'pull', 'push', 'legs', 'core', 'skill'
-- Difficulty tiers: 'foundational', 'intermediate', 'advanced'

INSERT INTO progression_paths (id, slug, name_en, name_es, description_en, description_es, category, difficulty_tier, icon) VALUES

-- =============================================
-- FOUNDATIONAL PATHS (Phase 1)
-- These are the 6 core movement patterns everyone should master
-- =============================================

-- 1. Pull-up Path (Vertical Pull)
(
  '11111111-0001-0000-0000-000000000001',
  'pull_up',
  'Pull-up Progression',
  'Progresión de Dominadas',
  'Master the vertical pull from dead hang to one arm pull-ups. The foundational pulling movement that builds lat, bicep, and grip strength.',
  'Domina la tracción vertical desde colgado pasivo hasta dominadas a una mano. El movimiento fundamental de tracción que construye fuerza en dorsales, bíceps y agarre.',
  'pull',
  'foundational',
  'arrow-up'
),

-- 2. Row Path (Horizontal Pull)
(
  '11111111-0001-0000-0000-000000000002',
  'row',
  'Row Progression',
  'Progresión de Remos',
  'Develop horizontal pulling strength from incline rows to front lever rows. Essential for shoulder health and balanced upper body development.',
  'Desarrolla fuerza de tracción horizontal desde remos inclinados hasta remos en front lever. Esencial para salud del hombro y desarrollo equilibrado del tren superior.',
  'pull',
  'foundational',
  'arrow-left'
),

-- 3. Dip Path (Vertical Push)
(
  '11111111-0001-0000-0000-000000000003',
  'dip',
  'Dip Progression',
  'Progresión de Fondos',
  'Build pressing strength from support holds to weighted ring dips. The counterpart to pull-ups for balanced upper body strength.',
  'Construye fuerza de empuje desde apoyos hasta fondos en anillas con lastre. El complemento de las dominadas para fuerza equilibrada del tren superior.',
  'push',
  'foundational',
  'arrow-down'
),

-- 4. Push-up Path (Horizontal Push)
(
  '11111111-0001-0000-0000-000000000004',
  'push_up',
  'Push-up Progression',
  'Progresión de Flexiones',
  'Progress from wall push-ups to one arm push-ups. The most versatile pushing exercise with countless variations for all levels.',
  'Progresa desde flexiones en pared hasta flexiones a una mano. El ejercicio de empuje más versátil con innumerables variaciones para todos los niveles.',
  'push',
  'foundational',
  'arrow-right'
),

-- 5. Squat Path (Lower Body Push)
(
  '11111111-0001-0000-0000-000000000005',
  'squat',
  'Squat Progression',
  'Progresión de Sentadillas',
  'Develop single leg strength from basic squats to pistols and shrimp squats. Essential for athletic performance and lower body strength.',
  'Desarrolla fuerza unilateral desde sentadillas básicas hasta pistols y shrimp squats. Esencial para rendimiento atlético y fuerza del tren inferior.',
  'legs',
  'foundational',
  'trending-down'
),

-- 6. Hinge Path (Lower Body Pull)
(
  '11111111-0001-0000-0000-000000000006',
  'hinge',
  'Nordic Curl Progression',
  'Progresión de Nordic Curls',
  'Build posterior chain strength from nordic negatives to full nordic curls. One of the best exercises for hamstring strength and injury prevention.',
  'Construye fuerza de cadena posterior desde negativos hasta nordic curls completos. Uno de los mejores ejercicios para fuerza de isquiotibiales y prevención de lesiones.',
  'legs',
  'foundational',
  'git-merge'
),

-- =============================================
-- INTERMEDIATE SKILL PATHS (Phase 2)
-- Unlock after mastering foundational movements
-- =============================================

-- 7. Muscle-up Path (Branch from Pull-up + Dip)
(
  '11111111-0001-0000-0000-000000000007',
  'muscle_up',
  'Muscle-up Progression',
  'Progresión de Muscle-ups',
  'Combine pulling and pushing strength to achieve the muscle-up. Requires chest-to-bar pull-ups and deep dips as prerequisites.',
  'Combina fuerza de tracción y empuje para lograr el muscle-up. Requiere dominadas pecho a barra y fondos profundos como prerrequisitos.',
  'skill',
  'intermediate',
  'zap'
),

-- 8. HSPU Path (Branch from Push-up + Handstand)
(
  '11111111-0001-0000-0000-000000000008',
  'hspu',
  'Handstand Push-up Progression',
  'Progresión de Flexiones en Pino',
  'Master overhead pressing with just your bodyweight. From pike push-ups to freestanding handstand push-ups.',
  'Domina el press vertical solo con tu peso corporal. Desde flexiones pike hasta flexiones en pino libre.',
  'push',
  'intermediate',
  'corner-up-left'
),

-- 9. L-sit Path (Core Compression)
(
  '11111111-0001-0000-0000-000000000009',
  'l_sit',
  'L-sit Progression',
  'Progresión de L-sit',
  'Develop core compression strength from supported L-sits to V-sits. Foundation for many advanced skills like press to handstand.',
  'Desarrolla fuerza de compresión desde L-sits con apoyo hasta V-sits. Base para muchas habilidades avanzadas como press a pino.',
  'core',
  'intermediate',
  'corner-down-right'
),

-- 10. Front Lever Path (Branch from Row)
(
  '11111111-0001-0000-0000-000000000010',
  'front_lever',
  'Front Lever Progression',
  'Progresión de Front Lever',
  'Master this iconic static hold. From tuck to full front lever, building incredible lat and core strength.',
  'Domina esta icónica postura estática. Desde agrupado hasta front lever completo, construyendo increíble fuerza de dorsales y core.',
  'pull',
  'intermediate',
  'minus'
),

-- =============================================
-- ADVANCED SKILL PATHS (Phase 3)
-- For dedicated calisthenics athletes
-- =============================================

-- 11. Planche Path (Ultimate Push)
(
  '11111111-0001-0000-0000-000000000011',
  'planche',
  'Planche Progression',
  'Progresión de Plancha',
  'One of the most impressive calisthenics skills. From frog stand to full planche - a multi-year journey requiring immense strength.',
  'Una de las habilidades más impresionantes de calistenia. Desde postura de rana hasta plancha completa - un viaje de años que requiere fuerza inmensa.',
  'push',
  'advanced',
  'maximize'
),

-- 12. Back Lever Path (Shoulder Flexibility + Strength)
(
  '11111111-0001-0000-0000-000000000012',
  'back_lever',
  'Back Lever Progression',
  'Progresión de Back Lever',
  'Develop shoulder flexibility and bicep strength for the back lever. From german hang to full back lever.',
  'Desarrolla flexibilidad de hombros y fuerza de bíceps para el back lever. Desde colgado alemán hasta back lever completo.',
  'pull',
  'advanced',
  'maximize-2'
),

-- 13. Dragon Flag Path (Advanced Core)
(
  '11111111-0001-0000-0000-000000000013',
  'dragon_flag',
  'Dragon Flag Progression',
  'Progresión de Dragon Flag',
  'Build incredible core strength with this Bruce Lee classic. From tuck dragon flags to full extended dragon flags.',
  'Construye increíble fuerza de core con este clásico de Bruce Lee. Desde dragon flags agrupadas hasta dragon flags completamente extendidas.',
  'core',
  'advanced',
  'flag'
);

