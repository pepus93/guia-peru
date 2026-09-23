import { tick } from 'svelte';
import { flashElement } from '$lib/stores/ui';

export async function scrollAndFlash(id: string): Promise<void> {
  for (let i = 0; i < 15; i++) {
    await tick();
    const el = document.getElementById(id);
    if (el) {
      // Wait for slide transitions (e.g. today's DayCard auto-expanding) to settle
      let prevTop = el.getBoundingClientRect().top;
      for (let j = 0; j < 40; j++) {
        await new Promise(r => requestAnimationFrame(r));
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top - prevTop) < 0.5) break;
        prevTop = top;
      }
      const target = el.closest<HTMLElement>('.day-group') ?? el;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      flashElement(id);
      return;
    }
    await new Promise(r => setTimeout(r, 80));
  }
}
