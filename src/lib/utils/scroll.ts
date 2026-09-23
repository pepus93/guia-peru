import { tick } from 'svelte';

export async function scrollToCurrent(): Promise<void> {
  await tick();
  const el = document.querySelector<HTMLElement>('.card.is-today')
          ?? document.querySelector<HTMLElement>('.card:not(.is-past)');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
