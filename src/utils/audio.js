// src/utils/audio.ts
let currentAudio = null;
let audioTimeout = null;
let userUnlocked = false;
let unlockPromise = null;

/**
 * Intenta desbloquear el audio usando AudioContext.resume() y un audio muteado.
 * Devuelve una Promise que resuelve a true si se desbloqueó.
 */
export function unlockAudioOnFirstGesture() {
  if (userUnlocked) return Promise.resolve(true);
  if (unlockPromise) return unlockPromise;

  unlockPromise = new Promise((resolve) => {
    const cleanup = () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      document.removeEventListener('touchstart', handler);
    };

    const handler = async () => {
      try {
        // 1) Intentar reanudar AudioContext (buen complemento)
        const AudioCtx = (window).AudioContext || (window).webkitAudioContext;
        if (AudioCtx) {
          try {
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
            // No lo mantengamos vivo (liberamos)
            try { ctx.close(); } catch {}
          } catch {}
        }

        // 2) Reproducir un audio muteado y pausarlo (truco para desbloquear)
        const a = new Audio();
        a.muted = true;
        a.preload = 'auto';
        // un pequeño blob o data uri sería ideal si quieres evitar fetch externo
        try {
          await a.play().catch(() => {});
          a.pause();
        } catch {}

        userUnlocked = true;
        cleanup();
        resolve(true);
      } catch {
        cleanup();
        resolve(false);
      }
    };

    document.addEventListener('click', handler, { once: true, passive: true });
    document.addEventListener('keydown', handler, { once: true, passive: true });
    document.addEventListener('touchstart', handler, { once: true, passive: true });

    // Timeout: si no hay interacción en X segundos, resolvemos false (opcional)
    setTimeout(() => {
      if (!userUnlocked) {
        cleanup();
        resolve(false);
      }
    }, 15000);
  });

  return unlockPromise;
}

export function isAudioUnlocked() {
  return userUnlocked;
}

export async function playAudio(url, duration = 3000) {
  // Si no está desbloqueado, intentamos desbloquear de forma silenciosa
  if (!userUnlocked) {
    // No hacemos await aquí por defecto para no bloquear el flujo, 
    // pero intentamos desbloquear en background.
    unlockAudioOnFirstGesture();
    // advertencia solo la primera vez
    if (!userUnlocked) {
      console.warn('Audio no desbloqueado aún. La reproducción puede ser bloqueada por el navegador.');
    }
  }

  stopAlarm();

  currentAudio = new Audio(url);
  currentAudio.preload = 'auto';
  currentAudio.volume = 0.07;
  currentAudio.loop = true;
  currentAudio.autoplay = false;

  try {
    await currentAudio.play();
  } catch (err) {
    // si falla, log con detalle
    console.error('Error al reproducir audio:', err?.name, err?.message);
    return;
  }

  if (audioTimeout) {
    clearTimeout(audioTimeout);
    audioTimeout = null;
  }
  audioTimeout = window.setTimeout(() => stopAlarm(), duration);
}

export function stopAlarm() {
  if (audioTimeout) {
    clearTimeout(audioTimeout);
    audioTimeout = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {}
    currentAudio = null;
  }
}
