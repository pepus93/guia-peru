<script lang="ts">
  import { modal, closeModal, bpModal, closeBpModal } from '$lib/stores/ui';
  import ActivityForm      from '$lib/components/forms/ActivityForm.svelte';
  import FlightForm        from '$lib/components/forms/FlightForm.svelte';
  import HotelForm         from '$lib/components/forms/HotelForm.svelte';
  import BoardingPassForm  from '$lib/components/forms/BoardingPassForm.svelte';
  import { fly, fade }     from 'svelte/transition';
  import { onDestroy }     from 'svelte';
  import { beforeNavigate } from '$app/navigation';

  beforeNavigate(() => {
    if ($modal.open)   closeModal();
    if ($bpModal.open) closeBpModal();
  });

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) closeModal();
  }
  function onBpBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) closeBpModal();
  }

  // ── Scroll lock ───────────────────────────────────────────
  let scrollY = 0;

  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position   = 'fixed';
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.left       = '0';
    document.body.style.right      = '0';
    document.body.style.overflowY  = 'scroll'; // keeps scrollbar width stable
  }

  function unlockScroll() {
    document.body.style.position  = '';
    document.body.style.top       = '';
    document.body.style.left      = '';
    document.body.style.right     = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, scrollY);
  }

  $: if ($modal.open || $bpModal.open) lockScroll();
  else unlockScroll();

  onDestroy(unlockScroll);

  // ── Drag-to-dismiss ───────────────────────────────────────
  let dragY    = 0;
  let startY   = 0;
  let dragging = false;

  function handleTouchStart(e: TouchEvent) {
    startY   = e.touches[0].clientY;
    dragY    = 0;
    dragging = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!dragging) return;
    e.preventDefault();
    const delta = e.touches[0].clientY - startY;
    dragY = Math.max(0, delta);
  }

  function handleTouchEnd(closeFn: () => void) {
    dragging = false;
    if (dragY > 80) { dragY = 0; closeFn(); }
    else dragY = 0;
  }
</script>

{#if $modal.open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" transition:fade={{ duration: 180 }} on:click={onBackdrop}>
    <div
      class="modal-sheet"
      role="dialog"
      aria-modal="true"
      transition:fly={{ y: 360, duration: 280, opacity: 1 }}
      style="transform: translateY({dragY}px); transition: {dragging ? 'none' : 'transform .3s cubic-bezier(0.25,0.46,0.45,0.94)'}"
    >
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="modal-handle"
        on:touchstart={handleTouchStart}
        on:touchmove|preventDefault={handleTouchMove}
        on:touchend={() => handleTouchEnd(closeModal)}
      ></div>
      <div class="modal-body">
        {#if $modal.kind === 'activity'}
          <ActivityForm data={$modal.data} />
        {:else if $modal.kind === 'flight'}
          <FlightForm data={$modal.data} />
        {:else if $modal.kind === 'hotel'}
          <HotelForm data={$modal.data} />
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if $bpModal.open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" transition:fade={{ duration: 180 }} on:click={onBpBackdrop}>
    <div
      class="modal-sheet"
      role="dialog"
      aria-modal="true"
      transition:fly={{ y: 360, duration: 280, opacity: 1 }}
      style="transform: translateY({dragY}px); transition: {dragging ? 'none' : 'transform .3s cubic-bezier(0.25,0.46,0.45,0.94)'}"
    >
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="modal-handle"
        on:touchstart={handleTouchStart}
        on:touchmove|preventDefault={handleTouchMove}
        on:touchend={() => handleTouchEnd(closeBpModal)}
      ></div>
      <div class="modal-body">
        <BoardingPassForm />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    z-index: 50;
    display: flex;
    align-items: flex-end;
    max-width: 520px;
    margin: 0 auto;
  }

  .modal-sheet {
    width: 100%;
    background: var(--card);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding-bottom: calc(var(--safe-bottom) + 20px);
    max-height: 90dvh;
    overflow-y: auto;
    will-change: transform;
  }

  .modal-handle {
    width: 40px; height: 4px;
    background: var(--line);
    border-radius: 99px;
    margin: 12px auto 6px;
    cursor: grab;
    touch-action: none;
    /* Bigger tap area */
    padding: 12px 40px;
    box-sizing: content-box;
    margin-left: auto; margin-right: auto;
    width: 40px;
  }

  .modal-body { padding: 0 20px 20px; }
</style>
