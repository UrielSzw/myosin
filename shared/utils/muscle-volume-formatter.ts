import { MuscleVolumeData } from "@/shared/ui/volume-chart";

/**
 * Utilidad para formatear datos de volumen muscular con traducción y cálculos
 */
export class MuscleVolumeFormatter {
  /**
   * Diccionario de traducción de categorías musculares
   */
  private static readonly CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    chest: "Pecho",
    back: "Espalda",
    shoulders: "Hombros",
    arms: "Brazos",
    legs: "Piernas",
    core: "Core",
    other: "Otro",
  };

  /**
   * Formatea datos de volumen raw a formato display con traducciones y porcentajes
   * @param rawVolumeData - Objeto con categorías como keys y volumen como values
   * @returns Array de MuscleVolumeData formateado y filtrado
   */
  static formatVolumeData(
    rawVolumeData: Record<string, number>
  ): MuscleVolumeData[] {
    // Filtrar solo categorías con volumen > 0 y mapear con traducciones
    const volumeByCategory = Object.entries(rawVolumeData)
      .filter(([_, volume]) => volume > 0)
      .map(([category, volume]) => ({
        category: this.CATEGORY_DISPLAY_NAMES[category] || category,
        sets: volume,
        percentage: 0, // Se calculará después
      }));

    // Calcular total para porcentajes
    const totalSets = Object.values(rawVolumeData).reduce(
      (sum, volume) => sum + volume,
      0
    );

    // Calcular porcentajes
    volumeByCategory.forEach((item) => {
      item.percentage = totalSets > 0 ? (item.sets / totalSets) * 100 : 0;
    });

    console.log(volumeByCategory);

    // Ordenar por cantidad de sets (mayor a menor)
    return volumeByCategory.sort((a, b) => b.sets - a.sets);
  }

  /**
   * Traduce una categoría muscular individual
   * @param category - Categoría en inglés
   * @returns Categoría traducida al español
   */
  static translateCategory(category: string): string {
    return this.CATEGORY_DISPLAY_NAMES[category] || category;
  }

  /**
   * Obtiene todas las categorías disponibles con sus traducciones
   * @returns Record con categorías en inglés como keys y español como values
   */
  static getAllCategories(): Record<string, string> {
    return { ...this.CATEGORY_DISPLAY_NAMES };
  }
}
