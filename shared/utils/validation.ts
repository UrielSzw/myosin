/**
 * Validation Schemas using Zod
 *
 * Central place for all runtime validations.
 * Use these schemas to validate data from:
 * - API responses
 * - User inputs
 * - Database queries
 * - External sources
 *
 * Benefits:
 * - Runtime type safety (TypeScript only checks at compile time)
 * - Consistent error messages
 * - Automatic type inference
 * - Data transformation/parsing
 */

import { z } from "zod";

// =============================================================================
// PRIMITIVE SCHEMAS
// =============================================================================

/**
 * UUID validation schema
 * Validates standard UUID v4 format
 */
export const uuidSchema = z.string().uuid();

/**
 * ISO date string validation
 * Validates ISO 8601 date strings (e.g., "2024-01-15T10:30:00.000Z")
 */
export const isoDateSchema = z.string().datetime();

/**
 * Positive integer validation
 * For quantities, counts, etc.
 */
export const positiveIntSchema = z.number().int().positive();

/**
 * Non-negative number validation
 * For weights, durations, etc. (can be 0)
 */
export const nonNegativeSchema = z.number().nonnegative();

/**
 * Email validation
 */
export const emailSchema = z.string().email();

// =============================================================================
// USER SCHEMAS
// =============================================================================

export const userIdSchema = uuidSchema;

export const userProfileSchema = z.object({
  id: uuidSchema,
  email: emailSchema.nullable(),
  name: z.string().min(1).max(100).nullable(),
  avatar_url: z.string().url().nullable().optional(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// =============================================================================
// EXERCISE SCHEMAS
// =============================================================================

export const muscleGroupSchema = z.enum([
  "chest",
  "shoulders",
  "triceps",
  "back",
  "biceps",
  "core",
  "legs",
  "full_body",
]);

export type MuscleGroup = z.infer<typeof muscleGroupSchema>;

export const exerciseSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(200),
  muscle_group: muscleGroupSchema,
  description: z.string().nullable(),
  is_custom: z.boolean().default(false),
  user_id: uuidSchema.nullable(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// =============================================================================
// ROUTINE SCHEMAS
// =============================================================================

export const routineSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  folder_id: uuidSchema.nullable(),
  user_id: uuidSchema,
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
  is_deleted: z.boolean().default(false),
  deleted_at: isoDateSchema.nullable(),
});

export type Routine = z.infer<typeof routineSchema>;

export const blockSchema = z.object({
  id: uuidSchema,
  routine_id: uuidSchema,
  name: z.string().min(1).max(100),
  order: z.number().int().nonnegative(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type Block = z.infer<typeof blockSchema>;

export const exerciseInBlockSchema = z.object({
  id: uuidSchema,
  block_id: uuidSchema,
  exercise_id: uuidSchema,
  order: z.number().int().nonnegative(),
  sets_count: positiveIntSchema.default(3),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type ExerciseInBlock = z.infer<typeof exerciseInBlockSchema>;

// =============================================================================
// WORKOUT SESSION SCHEMAS
// =============================================================================

export const workoutSessionSchema = z.object({
  id: uuidSchema,
  routine_id: uuidSchema.nullable(),
  user_id: uuidSchema,
  started_at: isoDateSchema,
  finished_at: isoDateSchema.nullable(),
  duration_seconds: nonNegativeSchema.nullable(),
  notes: z.string().nullable(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type WorkoutSession = z.infer<typeof workoutSessionSchema>;

export const setSchema = z.object({
  id: uuidSchema,
  exercise_in_block_id: uuidSchema,
  workout_session_id: uuidSchema,
  set_number: positiveIntSchema,
  weight: nonNegativeSchema.nullable(),
  reps: positiveIntSchema.nullable(),
  duration_seconds: nonNegativeSchema.nullable(),
  distance: nonNegativeSchema.nullable(),
  is_completed: z.boolean().default(false),
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type Set = z.infer<typeof setSchema>;

// =============================================================================
// FOLDER SCHEMAS
// =============================================================================

export const folderSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable(),
  user_id: uuidSchema,
  created_at: isoDateSchema,
  updated_at: isoDateSchema.nullable(),
});

export type Folder = z.infer<typeof folderSchema>;

// =============================================================================
// API RESPONSE SCHEMAS
// =============================================================================

/**
 * Generic paginated response schema
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    data: z.array(itemSchema),
    total: nonNegativeSchema,
    page: positiveIntSchema,
    pageSize: positiveIntSchema,
    hasMore: z.boolean(),
  });

/**
 * Generic API error response
 */
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Safe parse that returns a Result type
 * Use this for validating external data (API responses, user input)
 *
 * @example
 * const result = safeParse(exerciseSchema, apiResponse);
 * if (result.success) {
 *   // result.data is typed as Exercise
 *   console.log(result.data.name);
 * } else {
 *   // result.error contains validation errors
 *   logger.error('Invalid exercise data', { error: result.error });
 * }
 */
export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  return schema.safeParse(data);
}

/**
 * Parse that throws on invalid data
 * Use this when you're confident the data should be valid
 * (e.g., data from your own database)
 *
 * @example
 * const exercise = parse(exerciseSchema, dbRow);
 * // exercise is typed as Exercise, throws if invalid
 */
export function parse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.output<T> {
  return schema.parse(data);
}

/**
 * Validate and return boolean
 * Useful for quick checks without error details
 *
 * @example
 * if (isValid(uuidSchema, id)) {
 *   // id is a valid UUID
 * }
 */
export function isValid<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): data is z.output<T> {
  return schema.safeParse(data).success;
}

/**
 * Create a validator function for a schema
 * Useful for reusable validation
 *
 * @example
 * const validateExercise = createValidator(exerciseSchema);
 * const result = validateExercise(data);
 */
export function createValidator<T extends z.ZodTypeAny>(schema: T) {
  return (data: unknown) => safeParse(schema, data);
}

// =============================================================================
// FORM VALIDATION SCHEMAS
// =============================================================================

/**
 * Form schemas are typically more lenient than database schemas
 * They validate user input before it's processed
 */

export const createRoutineFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "El nombre es muy largo"),
  description: z.string().max(500, "La descripción es muy larga").optional(),
  folder_id: uuidSchema.nullable().optional(),
});

export type CreateRoutineForm = z.infer<typeof createRoutineFormSchema>;

export const createExerciseFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "El nombre es muy largo"),
  muscle_group: muscleGroupSchema,
  description: z.string().max(1000, "La descripción es muy larga").optional(),
});

export type CreateExerciseForm = z.infer<typeof createExerciseFormSchema>;

export const createFolderFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color inválido")
    .optional(),
});

export type CreateFolderForm = z.infer<typeof createFolderFormSchema>;

// =============================================================================
// SYNC SCHEMAS
// =============================================================================

export const syncStatusSchema = z.enum([
  "pending",
  "synced",
  "conflict",
  "error",
]);

export type SyncStatus = z.infer<typeof syncStatusSchema>;

export const syncOperationSchema = z.enum(["create", "update", "delete"]);

export type SyncOperation = z.infer<typeof syncOperationSchema>;

export const pendingSyncItemSchema = z.object({
  id: uuidSchema,
  table_name: z.string(),
  record_id: uuidSchema,
  operation: syncOperationSchema,
  data: z.record(z.string(), z.unknown()),
  created_at: isoDateSchema,
  retry_count: nonNegativeSchema.default(0),
});

export type PendingSyncItem = z.infer<typeof pendingSyncItemSchema>;
