-- ============================================================================
-- PROGRESSION TREES - SUPABASE SCHEMA
-- ============================================================================
-- Ejecutar este script para crear las tablas de progresiones en Supabase
-- 
-- ORDEN DE EJECUCIÓN:
-- 1. Este archivo (schema)
-- 2. seed-progressions-pullup.sql
-- 3. seed-progressions-pushup.sql
-- 4. seed-progressions-dip.sql
-- (más seeds según se agreguen)
-- ============================================================================

-- ============================================================================
-- TABLE 1: exercise_progressions
-- Almacena las relaciones entre ejercicios
-- ============================================================================

CREATE TABLE IF NOT EXISTS exercise_progressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- RELACIÓN
    from_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    to_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    
    -- TIPO DE RELACIÓN
    -- progression: from es más fácil que to
    -- prerequisite: from es REQUERIDO para to
    -- variation: alternativas del mismo nivel
    -- regression: from es más difícil que to
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('progression', 'prerequisite', 'variation', 'regression')),
    
    -- CRITERIOS DE UNLOCK (JSON)
    -- {
    --   "type": "reps" | "time" | "weight" | "weight_reps" | "sets_reps" | "manual",
    --   "primary_value": number,
    --   "secondary_value": number (optional),
    --   "sets": number (optional),
    --   "description_key": "criteria.pullups_3x8" (translation key)
    -- }
    unlock_criteria JSONB,
    
    -- METADATA
    difficulty_delta INTEGER DEFAULT 1, -- +1, +2, -1 para regression
    notes TEXT, -- Tips, técnica (translation key)
    source TEXT DEFAULT 'system' CHECK (source IN ('system', 'community')),
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CONSTRAINTS
    CONSTRAINT unique_progression UNIQUE (from_exercise_id, to_exercise_id, relationship_type)
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_progressions_from ON exercise_progressions(from_exercise_id);
CREATE INDEX IF NOT EXISTS idx_progressions_to ON exercise_progressions(to_exercise_id);
CREATE INDEX IF NOT EXISTS idx_progressions_type ON exercise_progressions(relationship_type);

-- ============================================================================
-- TABLE 2: progression_paths
-- Agrupa ejercicios en "caminos" hacia un objetivo final
-- ============================================================================

CREATE TABLE IF NOT EXISTS progression_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- IDENTIFICACIÓN
    slug TEXT NOT NULL UNIQUE, -- "pullup-progression"
    name_key TEXT NOT NULL, -- Translation key: "paths.pullup.name"
    description_key TEXT, -- Translation key: "paths.pullup.description"
    
    -- CATEGORÍA
    category TEXT NOT NULL CHECK (category IN (
        'vertical_pull',
        'horizontal_pull', 
        'vertical_push',
        'horizontal_push',
        'squat',
        'hinge',
        'core',
        'skill'
    )),
    
    -- OBJETIVO FINAL
    ultimate_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    
    -- UI
    icon TEXT, -- Lucide icon name
    color TEXT, -- Hex color
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_paths_slug ON progression_paths(slug);
CREATE INDEX IF NOT EXISTS idx_paths_category ON progression_paths(category);

-- ============================================================================
-- TABLE 3: progression_path_exercises
-- Relaciona ejercicios con sus paths y define el nivel de dificultad
-- ============================================================================

CREATE TABLE IF NOT EXISTS progression_path_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    path_id UUID NOT NULL REFERENCES progression_paths(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    
    -- NIVEL EN EL PATH
    level INTEGER NOT NULL, -- 1 = más fácil, 10 = skill final
    
    -- FLAGS
    is_main_path BOOLEAN DEFAULT true,
    -- false = variación alternativa, no el camino principal
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CONSTRAINTS
    CONSTRAINT unique_path_exercise UNIQUE (path_id, exercise_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_path_exercises_path ON progression_path_exercises(path_id);
CREATE INDEX IF NOT EXISTS idx_path_exercises_exercise ON progression_path_exercises(exercise_id);

-- ============================================================================
-- TABLE 4: user_exercise_unlocks
-- Trackea el progreso del usuario en cada ejercicio
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_exercise_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    
    -- ESTADO
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocking', 'unlocked', 'mastered')),
    
    -- UNLOCK INFO
    unlocked_at TIMESTAMPTZ,
    unlocked_by_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    unlocked_by_pr_id UUID, -- Reference to pr if needed
    
    -- PROGRESO ACTUAL (JSON)
    -- {
    --   "current_value": number,
    --   "target_value": number,
    --   "percentage": number
    -- }
    current_progress JSONB,
    
    -- OVERRIDE MANUAL
    manually_unlocked BOOLEAN DEFAULT false,
    manually_unlocked_at TIMESTAMPTZ,
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CONSTRAINTS
    CONSTRAINT unique_user_exercise_unlock UNIQUE (user_id, exercise_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_unlocks_user ON user_exercise_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_unlocks_exercise ON user_exercise_unlocks(exercise_id);
CREATE INDEX IF NOT EXISTS idx_unlocks_status ON user_exercise_unlocks(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- exercise_progressions: público de lectura (es catálogo)
ALTER TABLE exercise_progressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exercise progressions"
    ON exercise_progressions FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify exercise progressions"
    ON exercise_progressions FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- progression_paths: público de lectura (es catálogo)
ALTER TABLE progression_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read progression paths"
    ON progression_paths FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify progression paths"
    ON progression_paths FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- progression_path_exercises: público de lectura (es catálogo)
ALTER TABLE progression_path_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read progression path exercises"
    ON progression_path_exercises FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify progression path exercises"
    ON progression_path_exercises FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- user_exercise_unlocks: solo el usuario puede ver/modificar sus datos
ALTER TABLE user_exercise_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own unlocks"
    ON user_exercise_unlocks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocks"
    ON user_exercise_unlocks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unlocks"
    ON user_exercise_unlocks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unlocks"
    ON user_exercise_unlocks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS para updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercise_progressions_updated_at
    BEFORE UPDATE ON exercise_progressions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progression_paths_updated_at
    BEFORE UPDATE ON progression_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progression_path_exercises_updated_at
    BEFORE UPDATE ON progression_path_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_exercise_unlocks_updated_at
    BEFORE UPDATE ON user_exercise_unlocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RPC: get_progressions_for_sync
-- Para sincronizar las progressions al cliente (similar a exercises)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_progressions_for_sync()
RETURNS TABLE (
    id UUID,
    from_exercise_id UUID,
    to_exercise_id UUID,
    relationship_type TEXT,
    unlock_criteria JSONB,
    difficulty_delta INTEGER,
    notes TEXT,
    source TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id,
        ep.from_exercise_id,
        ep.to_exercise_id,
        ep.relationship_type,
        ep.unlock_criteria,
        ep.difficulty_delta,
        ep.notes,
        ep.source,
        ep.created_at,
        ep.updated_at
    FROM exercise_progressions ep
    WHERE ep.source = 'system'
    ORDER BY ep.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC: get_progression_paths_for_sync
-- Para sincronizar los paths al cliente
-- ============================================================================

CREATE OR REPLACE FUNCTION get_progression_paths_for_sync()
RETURNS TABLE (
    id UUID,
    slug TEXT,
    name_key TEXT,
    description_key TEXT,
    category TEXT,
    ultimate_exercise_id UUID,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    exercises JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.id,
        pp.slug,
        pp.name_key,
        pp.description_key,
        pp.category,
        pp.ultimate_exercise_id,
        pp.icon,
        pp.color,
        pp.created_at,
        pp.updated_at,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', ppe.id,
                    'exercise_id', ppe.exercise_id,
                    'level', ppe.level,
                    'is_main_path', ppe.is_main_path
                ) ORDER BY ppe.level
            ) FILTER (WHERE ppe.id IS NOT NULL),
            '[]'::jsonb
        ) as exercises
    FROM progression_paths pp
    LEFT JOIN progression_path_exercises ppe ON pp.id = ppe.path_id
    GROUP BY pp.id
    ORDER BY pp.category, pp.slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
