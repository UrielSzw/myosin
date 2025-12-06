/**
 * Repository Types - Base interfaces for all repositories
 *
 * Estas interfaces definen los contratos que cualquier repositorio debe implementar.
 * Son agnósticas al storage (SQLite, Supabase, Firebase, etc.)
 */

/**
 * Operaciones básicas de lectura para cualquier entidad
 */
export interface IReadRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
}

/**
 * Operaciones básicas de escritura para cualquier entidad
 */
export interface IWriteRepository<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
  ID = string
> {
  create(data: CreateDTO): Promise<T>;
  update(id: ID, data: UpdateDTO): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Repositorio completo con lectura y escritura
 */
export interface IRepository<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
  ID = string
> extends IReadRepository<T, ID>,
    IWriteRepository<T, CreateDTO, UpdateDTO, ID> {}

/**
 * Resultado de una operación de sync
 */
export interface SyncResult {
  success: boolean;
  queued?: boolean;
  error?: string;
}

/**
 * Configuración para el SyncedRepository wrapper
 */
export interface SyncConfig<CreateDTO, UpdateDTO> {
  /** Mutation code para CREATE */
  createMutation?: string;
  /** Mutation code para UPDATE */
  updateMutation?: string;
  /** Mutation code para DELETE */
  deleteMutation?: string;
  /** Transforma el DTO de create al payload de sync (si es diferente) */
  createPayloadTransform?: (data: CreateDTO, result: unknown) => unknown;
  /** Transforma el DTO de update al payload de sync (si es diferente) */
  updatePayloadTransform?: (
    id: string,
    data: UpdateDTO,
    result: unknown
  ) => unknown;
  /** Transforma el id al payload de delete (si es diferente) */
  deletePayloadTransform?: (id: string) => unknown;
}

/**
 * Interface para el adaptador de sync
 */
export interface ISyncAdapter {
  sync(mutationCode: string, payload: unknown): Promise<SyncResult>;
}
