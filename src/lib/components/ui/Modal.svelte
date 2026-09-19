<script lang="ts">
  import { modal, closeModal, bpModal, closeBpModal } from '$lib/stores/ui';
  import ActivityForm      from '$lib/components/forms/ActivityForm.svelte';
  import FlightForm        from '$lib/components/forms/FlightForm.svelte';
  import HotelForm         from '$lib/components/forms/HotelForm.svelte';
  import BoardingPassForm  from '$lib/components/forms/BoardingPassForm.svelte';
  import { fly, fade }     from 'svelte/transition';

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) closeModal();
  }
  function onBpBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) closeBpModal();
  }
</script>

{#if $modal.open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" transition:fade={{ duration: 180 }} on:click={onBackdrop}>
    <div class="modal-sheet" role="dialog" aria-modal="true" transition:fly={{ y: 360, duration: 280, opacity: 1 }}>
      <div class="modal-handle"></div>
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
    <div class="modal-sheet" role="dialog" aria-modal="true" transition:fly={{ y: 360, duration: 280, opacity: 1 }}>
      <div class="modal-handle"></div>
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
    background: rgba(42,26,18,.55);
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
  }

  .modal-handle {
    width: 40px; height: 4px;
    background: var(--line);
    border-radius: 99px;
    margin: 12px auto 6px;
  }

  .modal-body { padding: 0 20px 20px; }
</style>
