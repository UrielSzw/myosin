export const syncStatusTranslations = {
  // SyncStatusHeader
  title: {
    es: "Estado de Sync",
    en: "Sync Status",
  },

  // DataSummaryCard
  sectionTitleLocalData: {
    es: "Datos Locales",
    en: "Local Data",
  },
  synced: {
    es: "sincronizados",
    en: "synced",
  },
  unsynced: {
    es: "sin sincronizar",
    en: "unsynced",
  },
  allSynced: {
    es: "Todo sincronizado",
    en: "All synced",
  },

  // Table display names
  tableRoutines: {
    es: "Rutinas",
    en: "Routines",
  },
  tableFolders: {
    es: "Carpetas",
    en: "Folders",
  },
  tableWorkoutSessions: {
    es: "Entrenamientos",
    en: "Workouts",
  },
  tablePRCurrent: {
    es: "Records Personales",
    en: "Personal Records",
  },
  tableTrackerMetrics: {
    es: "Métricas",
    en: "Metrics",
  },
  tableTrackerEntries: {
    es: "Entradas Tracker",
    en: "Tracker Entries",
  },
  tableMacroEntries: {
    es: "Entradas Macros",
    en: "Macro Entries",
  },

  // GeneralStatusCard
  sectionTitleGeneral: {
    es: "Estado General",
    en: "General Status",
  },
  online: {
    es: "En línea",
    en: "Online",
  },
  offline: {
    es: "Sin conexión",
    en: "Offline",
  },
  statusSynced: {
    es: "Sincronizado",
    en: "Synced",
  },
  pendingSync: {
    es: "Sincronización pendiente",
    en: "Sync pending",
  },
  offlineNote: {
    es: "Los cambios se sincronizarán cuando vuelvas a estar en línea",
    en: "Changes will sync when you're back online",
  },
  allSyncedNote: {
    es: "Todos tus datos están sincronizados con la nube",
    en: "All your data is synced with the cloud",
  },
  pendingNote: {
    es: "Hay cambios locales esperando ser sincronizados",
    en: "There are local changes waiting to be synced",
  },

  // QueueStatusCard
  sectionTitleQueue: {
    es: "Cola de Sincronización",
    en: "Sync Queue",
  },
  pending: {
    es: "Pendientes",
    en: "Pending",
  },
  processing: {
    es: "Procesando",
    en: "Processing",
  },
  failed: {
    es: "Con error",
    en: "Failed",
  },
  emptyQueue: {
    es: "La cola está vacía",
    en: "Queue is empty",
  },
  itemsInQueue: {
    es: "items en cola",
    en: "items in queue",
  },

  // SyncActions
  sectionTitleActions: {
    es: "Acciones",
    en: "Actions",
  },
  syncNow: {
    es: "Sincronizar Ahora",
    en: "Sync Now",
  },
  syncNowSubtitle: {
    es: "Procesar cola de sincronización",
    en: "Process sync queue",
  },
  syncing: {
    es: "Sincronizando...",
    en: "Syncing...",
  },
  clearQueue: {
    es: "Limpiar Cola",
    en: "Clear Queue",
  },
  clearQueueSubtitle: {
    es: "Eliminar items con error",
    en: "Remove failed items",
  },
  clearQueueAlertTitle: {
    es: "Limpiar Cola",
    en: "Clear Queue",
  },
  clearQueueAlertMessage: {
    es: "¿Estás seguro? Esto eliminará todos los items pendientes de sincronización. Los datos locales NO se eliminarán.",
    en: "Are you sure? This will remove all pending sync items. Local data will NOT be deleted.",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },
  confirm: {
    es: "Limpiar",
    en: "Clear",
  },
  noLocalData: {
    es: "No hay datos locales",
    en: "No local data",
  },
} as const;
