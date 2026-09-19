<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import Header     from '$lib/components/layout/Header.svelte';
  import BottomNav  from '$lib/components/layout/BottomNav.svelte';
  import Modal      from '$lib/components/ui/Modal.svelte';
  import { loadTrip } from '$lib/stores/trip';
  import { startClocks, modal } from '$lib/stores/ui';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';

  const ROUTES = ['/dias', '/vuelos', '/hoteles', '/planes', '/cambio', '/info'];

  onMount(() => {
    loadTrip();
    const interval = startClocks();
    return () => clearInterval(interval);
  });

  let touchStartX = 0;
  let touchStartY = 0;

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    if ($modal.open) return;

    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Ignorar si no es predominantemente horizontal o si el desplazamiento es muy corto
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;

    const idx = ROUTES.indexOf($page.url.pathname);
    if (idx === -1) return;

    if (dx < 0 && idx < ROUTES.length - 1) goto(ROUTES[idx + 1]);
    if (dx > 0 && idx > 0)                  goto(ROUTES[idx - 1]);
  }
</script>

<Header />
<svelte:window on:touchstart={onTouchStart} on:touchend={onTouchEnd} />
<main class="page">
  {#key $page.url.pathname}
    <div in:fade={{ duration: 160, delay: 60 }}>
      <slot />
    </div>
  {/key}
</main>
<BottomNav />
<Modal />
