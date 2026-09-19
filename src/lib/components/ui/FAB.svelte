<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ click: void }>();

  let visible = true;
  let lastY = 0;

  onMount(() => {
    function onScroll() {
      const y = window.scrollY;
      visible = y < lastY || y < 60;
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="fab-anchor">
  <button
    class="fab"
    class:fab-hidden={!visible}
    on:click={() => dispatch('click')}
    aria-label="Añadir"
  >
    <span class="fab-icon">+</span>
  </button>
</div>

<style>
  .fab-anchor {
    position: fixed;
    bottom: calc(var(--nav-height) + var(--safe-bottom) + 16px);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 520px;
    pointer-events: none;
    z-index: 30;
  }

  .fab {
    position: absolute;
    right: 20px;
    bottom: 0;
    pointer-events: auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--paper);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(42,26,18,.35);
    transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .2s, box-shadow .2s;
    will-change: transform, opacity;
  }

  .fab:active {
    transform: scale(.92);
    box-shadow: 0 2px 8px rgba(42,26,18,.25);
  }

  .fab-icon {
    font-size: 1.45rem;
    font-weight: 300;
    line-height: 1;
    margin-top: -1px;
  }

  .fab-hidden {
    transform: translateY(24px) scale(.85);
    opacity: 0;
    pointer-events: none;
  }
</style>
