/**
 * Mutex global que previene múltiples procesadores concurrentes de sync queue.
 *
 * Garantiza que solo un procesamiento de queue pueda ejecutarse a la vez
 * en toda la aplicación, eliminando race conditions.
 */
export class GlobalSyncLock {
  private static isProcessing = false;

  /**
   * Ejecuta una función de forma mutuamente exclusiva
   * Si ya hay un procesamiento en curso, retorna null inmediatamente
   *
   * @param fn Función async a ejecutar con lock
   * @returns Resultado de la función o null si no pudo obtener el lock
   */
  static async execute<T>(fn: () => Promise<T>): Promise<T | null> {
    console.log("🔐 [GlobalSyncLock] Attempting to acquire lock...");

    if (this.isProcessing) {
      console.log("🔒 [GlobalSyncLock] Already processing, skipping");
      return null;
    }

    this.isProcessing = true;
    console.log("🔓 [GlobalSyncLock] Lock acquired, starting processing");

    try {
      console.log("🔍 [GlobalSyncLock] About to call function...");
      console.log("🔥 [GlobalSyncLock] CALLING FUNCTION NOW...");
      const result = await fn();
      console.log("🔍 [GlobalSyncLock] Function returned result:", result);
      console.log("🔍 [GlobalSyncLock] Result type:", typeof result);
      console.log(
        "🔍 [GlobalSyncLock] Result JSON:",
        JSON.stringify(result, null, 2)
      );
      console.log("✅ [GlobalSyncLock] Processing completed successfully");
      return result;
    } catch (error) {
      console.error("💥 [GlobalSyncLock] Processing failed:", error);
      console.error(
        "💥 [GlobalSyncLock] Error stack:",
        error instanceof Error ? error.stack : "No stack available"
      );
      throw error;
    } finally {
      this.isProcessing = false;
      console.log("🔒 [GlobalSyncLock] Lock released");
    }
  }

  /**
   * Verifica si hay un procesamiento en curso
   *
   * @returns true si hay un lock activo
   */
  static isLocked(): boolean {
    return this.isProcessing;
  }

  /**
   * Información de debug del lock
   */
  static getDebugInfo() {
    return {
      isLocked: this.isProcessing,
      timestamp: new Date().toISOString(),
    };
  }
}
