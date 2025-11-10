# Myosin - Aplicación de Fitness

## 📋 Descripción General

**Myosin** es una aplicación móvil de fitness desarrollada con React Native y Expo, diseñada para el seguimiento y gestión de entrenamientos de fuerza. La aplicación implementa una arquitectura **local-first** con sincronización en la nube, proporcionando una experiencia fluida tanto online como offline.

## 🏗️ Arquitectura del Proyecto

### **Stack Tecnológico**

- **Frontend**: React Native 0.81.4 + Expo 54
- **Routing**: Expo Router (file-based routing)
- **Base de Datos Local**: SQLite + Drizzle ORM
- **Base de Datos Cloud**: Supabase (PostgreSQL)
- **Estado Global**: Zustand
- **Queries**: TanStack React Query
- **UI**: Custom components + Lucide React Native icons
- **Sincronización**: Custom sync engine con networking detection

### **Arquitectura Local-First**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │ ←→ │   SQLite Local   │ ←→ │  Supabase Cloud │
│   (UI Layer)    │    │   (Primary DB)   │    │  (Backup/Sync)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↑
                       ┌──────────────────┐
                       │   Sync Engine    │
                       │  (Fire & Forget) │
                       └──────────────────┘
```

## 📁 Estructura del Proyecto

```
myosin/
├── app/                          # Expo Router - Navegación
│   ├── (authenticated)/          # Rutas autenticadas
│   │   ├── (tabs)/              # Bottom tabs navigation
│   │   └── profile/             # Profile stack
│   ├── auth/                    # Pantallas de autenticación
│   └── _layout.tsx              # Root layout + providers
│
├── features/                     # Feature-based architecture
│   ├── active-workout/          # Workout en progreso
│   ├── analytics/               # Dashboard y estadísticas
│   ├── folder-form/             # Gestión de carpetas
│   ├── profile/                 # Perfil de usuario
│   ├── routine-form/            # Creación/edición de rutinas
│   ├── tracker/                 # Métricas personalizadas
│   └── workouts/                # Lista de rutinas
│
├── shared/                       # Código compartido
│   ├── db/                      # Base de datos
│   │   ├── schema/              # Schemas Drizzle
│   │   ├── repository/          # Data access layer
│   │   └── seed/                # Datos iniciales
│   ├── sync/                    # Sistema de sincronización
│   │   ├── repositories/        # Repositorios Supabase
│   │   ├── dictionary/          # Mapeo de mutations
│   │   └── types/               # Tipos del sync
│   ├── ui/                      # Componentes UI reutilizables
│   ├── hooks/                   # Custom hooks
│   ├── providers/               # Context providers
│   └── services/                # Servicios externos
│
└── assets/                       # Recursos estáticos
```

## 🗄️ Modelo de Datos

### **Entidades Principales**

1. **Users** - Usuarios y preferencias
2. **Exercises** - Catálogo de ejercicios (196 precargados)
3. **Routines** - Rutinas de entrenamiento
4. **Folders** - Organización de rutinas
5. **Workout Sessions** - Sesiones de entrenamiento completadas
6. **PRs** - Records personales
7. **Tracker** - Métricas personalizadas

### **Relaciones Clave**

```
User
├── Preferences (1:1)
├── Routines (1:N)
├── Folders (1:N)
├── Workout Sessions (1:N)
└── PRs (1:N)

Routine
├── Blocks (1:N)
└── Folder (N:1)

Block
└── Exercises (1:N)

Exercise
└── Sets (1:N)

Workout Session
├── Blocks (1:N) [snapshot]
├── Exercises (1:N) [snapshot]
└── Sets (1:N) [actual performance]
```

## 🎯 Características Principales

### **1. Gestión de Rutinas**

- ✅ Creación/edición de rutinas con bloques
- ✅ Organización por carpetas
- ✅ Soporte para supersets, circuits, y ejercicios individuales
- ✅ Configuración de RPE, tempo, rangos de repeticiones

### **2. Ejecución de Workouts**

- ✅ Modo workout activo con timer
- ✅ Seguimiento de sets completados
- ✅ Cálculo automático de PRs
- ✅ Guardado automático de progreso

### **3. Analytics y Progreso**

- ✅ Dashboard con métricas clave
- ✅ Historial de sesiones
- ✅ Tracking de volumen semanal por grupo muscular
- ✅ PRs y records personales

### **4. Personalización**

- ✅ Configuración de unidades (kg/lbs)
- ✅ Preferencias de RPE y Tempo
- ✅ Tema claro/oscuro
- ✅ Métricas personalizadas (tracker)

## 🔄 Sistema de Sincronización

### **Patrón Local-First**

1. **Escritura**: Todos los cambios se guardan primero en SQLite local
2. **UI**: Actualización inmediata de la interfaz
3. **Sync**: Sincronización en background a Supabase
4. **Offline**: Funcionalidad completa sin conexión

### **Mutations Implementadas**

- `ROUTINE_CREATE/UPDATE/DELETE`
- `FOLDER_CREATE/UPDATE/DELETE`
- `WORKOUT_COMPLETE`
- `PR_CREATE/UPDATE`
- `USER_PREFERENCES_CREATE/UPDATE`

## 🛠️ Patrones y Convenciones

### **Arquitectura de Features**

```
feature-name/
├── index.tsx                    # Componente principal
├── elements/                    # Sub-componentes
├── hooks/                       # Custom hooks específicos
├── service/                     # Lógica de negocio
├── types/                       # Tipos específicos
└── utils/                       # Utilidades del feature
```

### **Naming Conventions**

- **Components**: PascalCase (`WorkoutFeature`)
- **Hooks**: camelCase con `use` prefix (`useWorkoutData`)
- **Files**: kebab-case (`use-workout-data.ts`)
- **Types**: PascalCase con `I` prefix para interfaces (`IWorkoutData`)
- **Constants**: SCREAMING_SNAKE_CASE (`QUERY_KEYS`)

### **Hooks Patterns**

- **Data Fetching**: `use[Entity]Data` → React Query
- **State Management**: `use[Entity]Store` → Zustand
- **Actions**: `use[Entity]Actions` → Funciones de mutación
- **Forms**: `use[Entity]Form` → Gestión de formularios

## 📦 Dependencias Clave

### **Core**

- `expo` - Framework principal
- `react-native` - Runtime móvil
- `expo-router` - File-based routing

### **Data & State**

- `drizzle-orm` + `expo-sqlite` - ORM y base local
- `@supabase/supabase-js` - Cliente Supabase
- `@tanstack/react-query` - Data fetching
- `zustand` - Estado global

### **UI & UX**

- `lucide-react-native` - Icons
- `react-native-reanimated` - Animaciones
- `@gorhom/bottom-sheet` - Bottom sheets
- `react-native-gesture-handler` - Gestos

### **Utilities**

- `@react-native-community/netinfo` - Network status
- `expo-haptics` - Feedback háptico
- `react-native-draggable-flatlist` - Listas reordenables

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo
npm start                        # Expo dev server
npm run android                  # Android emulator
npm run ios                      # iOS simulator

# Database
npx drizzle-kit studio          # Drizzle Studio (local DB)
npx drizzle-kit generate        # Generate migrations

# Utilidades
npm run reset-project           # Reset starter template
npm run lint                    # ESLint
```

## 🔐 Configuración de Entorno

### **Variables de Entorno (.env.local)**

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Configuración de Base de Datos**

- **Local**: SQLite con Drizzle ORM
- **Cloud**: Supabase con RLS (Row Level Security)
- **Migraciones**: Automáticas con Drizzle Kit

## 📊 Estado Actual

### **✅ Implementado**

- ✅ Autenticación con Supabase
- ✅ CRUD completo de rutinas y carpetas
- ✅ Sistema de workout activo
- ✅ Sincronización local-first
- ✅ Analytics y dashboard
- ✅ Configuración de usuario
- ✅ Catálogo completo de ejercicios

### **🚧 En Desarrollo**

- 🚧 Cola de sync offline
- 🚧 Scheduler de sincronización automática
- 🚧 Tracker de métricas personalizadas
- 🚧 Exportación de datos

### **📋 Planificado**

- 📋 Planes de entrenamiento (programs)
- 📋 Social features
- 📋 Backup y restore
- 📋 Notificaciones push

## 🤝 Para Desarrolladores

### **Contribuir al Proyecto**

1. Seguir la arquitectura feature-based
2. Mantener el patrón local-first para todas las mutations
3. Usar TypeScript estricto
4. Implementar tests para lógica de negocio
5. Documentar nuevas features

### **Debugging**

- Logs de sync: Buscar `🔄 Attempting sync`
- Base de datos: Usar Drizzle Studio
- Network: Logs en consola para estado online/offline
- Supabase: Dashboard para queries y RPC functions

---

**Myosin** es una aplicación robusta diseñada para crecer, con una base sólida de arquitectura local-first y sincronización inteligente que garantiza una experiencia de usuario fluida en cualquier condición de red.
