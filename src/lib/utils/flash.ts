import { tick } from 'svelte';
import { flashElement } from '$lib/stores/ui';

export async function scrollAndFlash(id: string): Promise<void> {
  for (let i = 0; i < 15; i++) {
    await tick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashElement(id);
      return;
    }
    await new Promise(r => setTimeout(r, 80));
  }
}
