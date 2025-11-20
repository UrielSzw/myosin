import { supabase } from "../services/supabase";

export interface SecureMediaService {
  getExerciseMediaUrl(mediaPath: string): Promise<string | null>;
}

class SupabaseSecureMediaService implements SecureMediaService {
  private readonly BUCKET_NAME = "exercise-media";
  private readonly SIGNED_URL_EXPIRES_IN = 3600; // 1 hora

  /**
   * Obtiene una signed URL para acceder a un archivo de media de ejercicio
   * @param mediaPath - El path del archivo en el bucket (ej: "weighted-crunch-behind-head.gif")
   * @returns Promise<string | null> - La signed URL temporal o null si hay error
   */
  async getExerciseMediaUrl(mediaPath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(mediaPath, this.SIGNED_URL_EXPIRES_IN);

      if (error) {
        console.error("[SecureMedia] Error creating signed URL:", error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error("[SecureMedia] Unexpected error:", error);
      return null;
    }
  }
}

// Singleton instance
export const secureMediaService = new SupabaseSecureMediaService();

// Cache para signed URLs (evita regenerar constantemente)
class MediaUrlCache {
  private cache = new Map<string, { url: string; expiresAt: number }>();
  private readonly CACHE_BUFFER = 300; // 5 minutos antes de expiración

  async getCachedUrl(mediaPath: string): Promise<string | null> {
    const cached = this.cache.get(mediaPath);

    if (cached && Date.now() < cached.expiresAt - this.CACHE_BUFFER * 1000) {
      return cached.url;
    }

    // Generar nueva URL
    const newUrl = await secureMediaService.getExerciseMediaUrl(mediaPath);
    if (newUrl) {
      this.cache.set(mediaPath, {
        url: newUrl,
        expiresAt: Date.now() + 3600 * 1000, // 1 hora
      });
    }

    return newUrl;
  }

  clearCache(mediaPath?: string) {
    if (mediaPath) {
      this.cache.delete(mediaPath);
    } else {
      this.cache.clear();
    }
  }
}

export const mediaUrlCache = new MediaUrlCache();
