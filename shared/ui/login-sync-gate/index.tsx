/**
 * LoginSyncGate Component
 *
 * Wrapper que se muestra mientras se sincroniza al login.
 * Maneja:
 * - Loading states con progreso
 * - Bloqueo por queue de otro usuario
 * - Errores de sync
 *
 * OPTIMIZACIÓN: Si es el mismo usuario y está online, entra inmediatamente
 * y el sync se hace en background (no bloqueante).
 */

import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useUserPreferencesStore } from "../../hooks/use-user-preferences-store";
import { useAuth } from "../../providers/auth-provider";
import { useLoginSync } from "../../sync/hooks/use-login-sync";
import { IncrementalSyncService } from "../../sync/restore/incremental-sync";
import { QueueGateService } from "../../sync/restore/queue-gate";
import { Button } from "../button";
import { GradientBackground } from "../gradient-background";
import { Logo } from "../logo";
import { Typography } from "../typography";

// =============================================================================
// TYPES
// =============================================================================

interface LoginSyncGateProps {
  children: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const LoginSyncGate: React.FC<LoginSyncGateProps> = ({ children }) => {
  const { session, loading: isAuthLoading } = useAuth();
  const { state, performSync, retry, tryUnblock, forceUnblock } =
    useLoginSync();
  const loadUserPreferences = useUserPreferencesStore(
    (s) => s.mainActions.load
  );
  const queryClient = useQueryClient();

  const hasStartedSyncRef = useRef(false);
  const syncedUserIdRef = useRef<string | null>(null);
  const [isCheckingFastPath, setIsCheckingFastPath] = useState(true);

  // Animación del logo
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [scale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Ejecutar sync cuando hay sesión
  // OPTIMIZACIÓN: Si es same_user + online, entrar inmediatamente y sync en background
  useEffect(() => {
    const userId = session?.user?.id;

    // Si ya sincronizamos este usuario, no volver a hacerlo
    if (userId && userId === syncedUserIdRef.current) {
      setIsCheckingFastPath(false);
      return;
    }

    // Si no hay sesión o auth está cargando, no hacer nada
    if (!userId || isAuthLoading) {
      setIsCheckingFastPath(false);
      return;
    }

    // Si ya empezó el sync para este usuario, no duplicar
    if (hasStartedSyncRef.current && state.status !== "idle") {
      return;
    }

    hasStartedSyncRef.current = true;

    // Verificar si podemos usar el "fast path" (same user + online)
    const checkFastPath = async () => {
      try {
        const [lastUserId, isOnline] = await Promise.all([
          QueueGateService.getLastLoggedUserId(),
          IncrementalSyncService.checkOnlineStatus(),
        ]);

        const isSameUser = lastUserId === userId;

        // FAST PATH: Same user + online = entrar inmediatamente
        if (isSameUser && isOnline) {
          console.warn(
            "⚡ [LoginSyncGate] Fast path: same user + online, entering immediately"
          );

          // Marcar como synced para que muestre la app
          syncedUserIdRef.current = userId;
          setIsCheckingFastPath(false);

          // Cargar preferences desde SQLite local (ya existen)
          await loadUserPreferences(userId);
          console.warn(
            "⚡ [LoginSyncGate] Preferences loaded from local SQLite"
          );

          // Sync en background (fire-and-forget)
          performSync(userId).then(async (result) => {
            if (result?.success) {
              // Invalidar queries para refrescar con datos nuevos del server
              await queryClient.invalidateQueries();
              console.warn(
                "⚡ [LoginSyncGate] Background sync completed, queries invalidated"
              );
            }
          });

          return;
        }

        // SLOW PATH: Usuario diferente, offline, o primer login
        // Necesita sync bloqueante (full_reset si es otro usuario)
        console.warn(
          `🔄 [LoginSyncGate] Slow path: isSameUser=${isSameUser}, isOnline=${isOnline}`
        );
        setIsCheckingFastPath(false);

        performSync(userId).then(async (result) => {
          if (result?.success || state.status === "offline_allowed") {
            syncedUserIdRef.current = userId;

            // Invalidar TODAS las queries de React Query para forzar refetch con data fresca
            await queryClient.invalidateQueries();
            console.warn("✅ [LoginSyncGate] React Query cache invalidated");

            // Cargar preferencias al store DESPUÉS del sync exitoso
            await loadUserPreferences(userId);
            console.warn(
              "✅ [LoginSyncGate] Preferences loaded after sync for user:",
              userId
            );
          }
        });
      } catch (error) {
        console.error("[LoginSyncGate] Error in fast path check:", error);
        setIsCheckingFastPath(false);
        // Fallback al slow path
        performSync(userId);
      }
    };

    checkFastPath();
  }, [
    session?.user?.id,
    isAuthLoading,
    performSync,
    state.status,
    loadUserPreferences,
    queryClient,
  ]);

  // Si auth está cargando o verificando fast path, mostrar loading básico
  if (isAuthLoading || isCheckingFastPath) {
    return (
      <GradientBackground variant="subtle">
        <View style={styles.container}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Logo size={80} animated={false} />
          </Animated.View>
        </View>
      </GradientBackground>
    );
  }

  // Si no hay sesión, mostrar children (que debería redirigir a login)
  if (!session?.user?.id) {
    return <>{children}</>;
  }

  // Si sync completado exitosamente, mostrar app
  if (
    state.status === "success" ||
    state.status === "offline_allowed" ||
    syncedUserIdRef.current === session.user.id
  ) {
    return <>{children}</>;
  }

  // Mostrar UI de sync/loading/error/blocked - solo logo animado
  return (
    <GradientBackground variant="subtle">
      <Animated.View
        style={styles.container}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        {/* Logo animado */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Logo size={80} animated={false} />
        </Animated.View>

        {/* UI de bloqueo */}
        {state.status === "blocked" && state.blockReason && (
          <View style={styles.blockedContainer}>
            <View style={styles.buttonContainer}>
              <Button variant="primary" onPress={tryUnblock} fullWidth>
                Reintentar
              </Button>

              <Button
                variant="ghost"
                onPress={forceUnblock}
                style={styles.dangerButton}
              >
                <Typography variant="body2" color="error">
                  Descartar datos
                </Typography>
              </Button>
            </View>
          </View>
        )}

        {/* UI de error */}
        {state.status === "error" && (
          <View style={styles.errorContainer}>
            <Button variant="primary" onPress={retry} fullWidth>
              Reintentar
            </Button>
          </View>
        )}
      </Animated.View>
    </GradientBackground>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  blockedContainer: {
    marginTop: 32,
    width: "100%",
  },
  buttonContainer: {
    gap: 12,
  },
  dangerButton: {
    marginTop: 8,
  },
  errorContainer: {
    marginTop: 32,
    width: "100%",
  },
});
