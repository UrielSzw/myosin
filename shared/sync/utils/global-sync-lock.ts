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
    if (this.isProcessing) {
      return null;
    }

    this.isProcessing = true;

    try {
      const result = await fn();
      return result;
    } catch (error) {
      // Solo logueamos errores - importante para debugging en producción
      console.error("[GlobalSyncLock] Processing failed:", error);
      throw error;
    } finally {
      this.isProcessing = false;
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
