import { tick } from 'svelte';

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
