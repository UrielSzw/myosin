-- ============================================================================
-- TRIGGER: Auto-create user_preferences when user signs up
-- ============================================================================
-- This trigger automatically creates a user_preferences record with default
-- values when a new user is created in auth.users
-- ============================================================================

-- Function to create user preferences with defaults
CREATE OR REPLACE FUNCTION create_user_preferences_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (
        user_id,
        theme,
        weight_unit,
        language,
        show_rpe,
        show_tempo,
        default_rest_time_seconds
    ) VALUES (
        NEW.id,              -- user_id from auth.users
        'dark',              -- default theme
        'kg',                -- default weight unit
        'es',                -- default language (Spanish)
        false,               -- default show_rpe
        false,               -- default show_tempo
        60                   -- default rest time (60 seconds = 1 minute)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires after user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_preferences_on_signup();

-- ============================================================================
-- NOTES:
-- - SECURITY DEFINER: Allows the function to run with elevated privileges
--   to insert into public.user_preferences even if RLS is enabled
-- - AFTER INSERT: Runs after the user is created in auth.users
-- - Default values match the app defaults (dark theme, kg units, etc.)
-- ============================================================================
