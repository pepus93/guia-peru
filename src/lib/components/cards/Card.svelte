<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import CalendarLink from '$lib/components/ui/CalendarLink.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { inTrip, TODAY_DM } from '$lib/stores/today';

  export let id: string;
  export let flashing    = false;
  export let past        = false;
  export let hasLabel    = false;
  export let cssClass    = '';
  export let flashColor  = 'rgba(198,90,52,.5)';
  export let dayDm: number | undefined = undefined;
  export let endDm: number | undefined = undefined;
  export let collapsible = false;
  export let expanded    = false;
  export let onEdit: (() => void) | undefined = undefined;
  export let onDelete: (() => Promise<void>) | undefined = undefined;

  $: isToday    = dayDm !== undefined && $inTrip && TODAY_DM >= dayDm && TODAY_DM <= (endDm ?? dayDm);
  $: hasActions = onEdit !== undefined || onDelete !== undefined;

  let actionsOpen = false;
  let confirming  = false;

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    if (actionsOpen) { actionsOpen = false; confirming = false; }
    else             { actionsOpen = true;  confirming = false; }
  }

  function closeMenu() { actionsOpen = false; confirming = false; }

  function handleEdit(e: MouseEvent) {
    e.stopPropagation();
    closeMenu();
    onEdit?.();
  }

  function askDelete(e: MouseEvent) {
    e.stopPropagation();
    confirming = true;
  }

  async function confirmDelete(e: MouseEvent) {
    e.stopPropagation();
    closeMenu();
    await onDelete?.();
  }

  function cancelDelete(e: MouseEvent) {
    e.stopPropagation();
    confirming = false;
  }

  function onDocClick(e: MouseEvent) {
    if (!actionsOpen) return;
    const card = document.getElementById(id);
    if (!card?.contains(e.target as Node)) closeMenu();
  }

  function onSummaryClick() {
    if (actionsOpen) { closeMenu(); return; }
    expanded = !expanded;
  }

  // ── Swipe-to-reveal ───────────────────────────────────────
  const ACTIONS_W = 100;
  let swipeStartX  = 0;
  let swipeStartY  = 0;
  let swiping      = false;   // confirmed horizontal gesture
  let liveOffset   = 0;       // pixel offset during drag

  function onCardTouchStart(e: TouchEvent) {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    swiping     = false;
    liveOffset  = actionsOpen ? -ACTIONS_W : 0;
  }

  function onCardTouchMove(e: TouchEvent) {
    if (!hasActions) return;
    const dx = e.touches[0].clientX - swipeStartX;
    const dy = e.touches[0].clientY - swipeStartY;
    if (!swiping) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) return; // more vertical → scroll, ignore
      swiping = true;
    }
    const base   = actionsOpen ? -ACTIONS_W : 0;
    liveOffset   = Math.max(-ACTIONS_W, Math.min(0, base + dx));
    e.stopPropagation(); // prevent tab-swipe while dragging card
  }

  function onCardTouchEnd(e: TouchEvent) {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - swipeStartX;

    if (!actionsOpen && dx < -50) {
      actionsOpen = true;
      liveOffset  = -ACTIONS_W;
    } else if (actionsOpen && dx > 50) {
      closeMenu();
      liveOffset = 0;
    } else {
      liveOffset = actionsOpen ? -ACTIONS_W : 0; // snap back
    }
    e.stopPropagation();
  }

  $: innerTransform = swiping
    ? `translateX(${liveOffset}px)`
    : `translateX(${actionsOpen ? -ACTIONS_W : 0}px)`;
  $: innerTransition = swiping ? 'none' : 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94)';
</script>

<svelte:document on:click={onDocClick} />

<div
  {id}
  class="card {cssClass}"
  class:flash={flashing}
  class:is-past={past}
  class:is-today={isToday}
  class:has-label={hasLabel}
  style="--flash-color:{flashColor}"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="card-clip"
    on:touchstart={onCardTouchStart}
    on:touchmove={onCardTouchMove}
    on:touchend={onCardTouchEnd}
  >
    {#if hasActions}
      <div class="card-actions">
        {#if !confirming}
          <button class="ca-btn ca-edit" on:click={handleEdit} aria-label="Editar">
            <Icon name="pencil" size={22} />
          </button>
          <button class="ca-btn ca-del" on:click={askDelete} aria-label="Eliminar">
            <Icon name="trash" size={22} />
          </button>
        {:else}
          <button class="ca-btn ca-no"  on:click={cancelDelete} aria-label="Cancelar">
            <Icon name="x" size={22} />
          </button>
          <button class="ca-btn ca-yes" on:click={confirmDelete} aria-label="Confirmar borrado">
            <Icon name="check" size={22} />
          </button>
        {/if}
      </div>
    {/if}

    <div class="card-inner" class:has-cal={dayDm !== undefined} style="transform:{innerTransform};transition:{innerTransition}">
      {#if hasActions}
        <button class="cm-trigger" on:click={toggleMenu} aria-label="Opciones">
          <span class="dot"></span>
          <span class="dot"></span>
        </button>
      {/if}

      {#if collapsible}
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <div class="card-summary" on:click={onSummaryClick}>
          <slot />
        </div>
        {#if expanded}
          <div transition:slide={{ duration: 240, easing: cubicOut }}>
            <slot name="detail" />
          </div>
        {/if}
      {:else}
        <slot />
        <slot name="detail" />
      {/if}

      {#if dayDm !== undefined}
        <CalendarLink dm={dayDm} />
      {/if}
    </div>
  </div>
</div>

<style>
  /* ── Clip wrapper (clips the horizontal slide, not the badge) */
  .card-clip {
    overflow: hidden;
    border-radius: inherit;
    position: relative;
  }

  /* ── Sliding content ──────────────────────────────────── */
  .card-inner {
    background: var(--card);
    padding: 14px;
    position: relative;
    transition: transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .card-inner.has-cal { padding-bottom: 48px; }

  /* ── Revealed action buttons ──────────────────────────── */
  .card-actions {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 100px;
    display: flex;
    flex-direction: column;
    z-index: 0;
  }

  .ca-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: filter .12s;
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) {
    .ca-edit:hover { background: color-mix(in srgb, var(--clay)  22%, transparent); }
    .ca-del:hover  { background: color-mix(in srgb, var(--terra) 22%, transparent); color: var(--terra-deep); }
    .ca-no:hover   { background: color-mix(in srgb, var(--clay)  22%, transparent); }
    .ca-yes:hover  { background: color-mix(in srgb, var(--terra) 22%, transparent); color: var(--terra-deep); }
  }
  .ca-btn:active { filter: brightness(.82); }

  .ca-edit {
    background: color-mix(in srgb, var(--clay)  12%, transparent);
    color: var(--clay);
    border-bottom: 1px solid color-mix(in srgb, var(--clay) 15%, transparent);
  }
  .ca-del {
    background: color-mix(in srgb, var(--terra) 10%, transparent);
    color: var(--terra);
  }
  .ca-no  {
    background: color-mix(in srgb, var(--clay)  12%, transparent);
    color: var(--clay);
    border-bottom: 1px solid color-mix(in srgb, var(--clay) 15%, transparent);
  }
  .ca-yes {
    background: color-mix(in srgb, var(--terra) 12%, transparent);
    color: var(--terra);
  }

  /* ── Dots trigger ─────────────────────────────────────── */
  .cm-trigger {
    position: absolute;
    top: 8px; right: 8px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 24px; height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 0;
    transition: background .12s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .cm-trigger:active { background: rgba(0,0,0,.08); }

  .dot {
    display: block;
    width: 3.5px; height: 3.5px;
    border-radius: 50%;
    background: var(--ink-soft);
  }

  /* ── Collapsible toggle area ──────────────────────────── */
  .card-summary {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
</style>
