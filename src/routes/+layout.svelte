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
  import { dev } from '$app/environment';

  const ROUTES = ['/dias', '/vuelos', '/hoteles', '/planes', '/cambio', '/info'];
  const PIN = '8383';

  let unlocked = false;
  let pinInput = '';
  let pinError = false;

  onMount(() => {
    unlocked = dev || localStorage.getItem('pin_ok') === '1';
    if (unlocked) {
      loadTrip();
      const interval = startClocks();
      return () => clearInterval(interval);
    }
  });

  function submitPin() {
    if (pinInput === PIN) {
      localStorage.setItem('pin_ok', '1');
      unlocked = true;
      loadTrip();
      startClocks();
    } else {
      pinError = true;
      pinInput = '';
      setTimeout(() => (pinError = false), 800);
    }
  }

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

<svelte:window on:touchstart={onTouchStart} on:touchend={onTouchEnd} />

{#if !unlocked}
  <div class="pin-screen" in:fade={{ duration: 200 }}>
    <div class="pin-box" class:shake={pinError}>
      <div class="pin-logo font-serif">🌄</div>
      <div class="pin-title font-serif">Pepe & Sunta</div>
      <div class="pin-subtitle">Perú 2026</div>
      <form on:submit|preventDefault={submitPin} class="pin-form">
        <input
          class="pin-input"
          type="password"
          inputmode="numeric"
          maxlength="4"
          placeholder="····"
          bind:value={pinInput}
          autofocus
        />
        <button type="submit" class="pin-btn">Entrar</button>
      </form>
    </div>
  </div>
{:else}
  <Header />
  <main class="page">
    {#key $page.url.pathname}
      <div in:fade={{ duration: 160, delay: 60 }}>
        <slot />
      </div>
    {/key}
  </main>
  <BottomNav />
  <Modal />
{/if}

<style>
  .pin-screen {
    position: fixed; inset: 0;
    background: var(--paper);
    display: flex; align-items: center; justify-content: center;
    z-index: 999;
  }
  .pin-box {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 40px 32px;
    transition: transform .1s;
  }
  .pin-box.shake { animation: shake .4s ease; }

  .pin-logo { font-size: 2.8rem; line-height: 1; }
  .pin-title { font-size: 1.6rem; font-weight: 600; color: var(--ink); letter-spacing: -.02em; }
  .pin-subtitle { font-size: .82rem; color: var(--ink-soft); margin-bottom: 24px; }

  .pin-form { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 160px; }
  .pin-input {
    width: 100%; text-align: center; font-size: 1.6rem; letter-spacing: .35em;
    font-family: inherit; padding: 10px 12px;
    background: var(--card); border: 1px solid var(--line);
    border-radius: var(--radius-sm); outline: none;
    transition: border-color .15s;
  }
  .pin-input:focus { border-color: var(--terra); }
  .pin-btn {
    width: 100%; padding: 10px;
    background: var(--ink); color: var(--paper);
    border: none; border-radius: var(--radius-sm);
    font-family: inherit; font-size: .88rem; font-weight: 700;
    cursor: pointer; transition: background .15s;
  }
  .pin-btn:active { background: var(--terra); }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-6px); }
    80%       { transform: translateX(6px); }
  }
</style>
