import { tick } from 'svelte';
import { afterNavigate } from '$app/navigation';
import { get, type Readable } from 'svelte/store';

export async function scrollToCurrent(): Promise<void> {
  await tick();
  const today = document.querySelector<HTMLElement>('.card.is-today');
  if (today) { today.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  // Solo hay que buscar la primera futura si el viaje ya ha empezado (hay pasadas)
  if (document.querySelector('.card.is-past')) {
    const first = document.querySelector<HTMLElement>('.card:not(.is-past)');
    if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Encapsula el patrón pendingScroll + afterNavigate usado en todas las páginas con lista.
// Llama en el top-level del <script> de un componente Svelte.
// Devuelve la función de cleanup para usar en onDestroy.
export function useScrollToCurrent(loading: Readable<boolean>): () => void {
  let pendingScroll = false;

  const unsub = loading.subscribe(isLoading => {
    if (!isLoading && pendingScroll) {
      pendingScroll = false;
      scrollToCurrent();
    }
  });

  afterNavigate(({ to }) => {
    if (to?.url.searchParams.has('flash')) return;
    if (get(loading)) {
      pendingScroll = true;
    } else {
      scrollToCurrent();
    }
  });

  return unsub;
}
