<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { portal } from '$lib/utils/portal';

  export let onEdit: () => void;
  export let onDelete: () => Promise<void>;

  let open = false;
  let confirming = false;

  function show() { open = true; confirming = false; }
  function hide() { open = false; confirming = false; }

  function handleEdit() { hide(); onEdit(); }
  function askDelete() { confirming = true; }
  async function confirmDelete() { hide(); await onDelete(); }
</script>

<button class="cm-trigger" on:click|stopPropagation={show} aria-label="Opciones">
  <span class="dot"></span>
  <span class="dot"></span>
</button>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div use:portal class="cm-backdrop" transition:fade={{ duration: 180 }} on:click={hide}></div>

  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div use:portal class="cm-sheet" transition:fly={{ y: 260, duration: 220 }}>
    <div class="cm-handle"></div>

    {#if !confirming}
      <button class="cm-action" on:click={handleEdit}>
        <span class="cm-action-icon">✏️</span>
        <span>Editar</span>
      </button>
      <div class="cm-sep"></div>
      <button class="cm-action cm-danger" on:click={askDelete}>
        <span class="cm-action-icon">🗑️</span>
        <span>Eliminar</span>
      </button>
    {:else}
      <div class="cm-confirm-body">
        <p class="cm-confirm-q">¿Eliminar este elemento?</p>
        <div class="cm-confirm-btns">
          <button class="cm-btn-yes" on:click={confirmDelete}>Sí, eliminar</button>
          <button class="cm-btn-no"  on:click={() => (confirming = false)}>Cancelar</button>
        </div>
      </div>
    {/if}

    <div class="cm-sep"></div>
    <button class="cm-cancel" on:click={hide}>Cancelar</button>
  </div>
{/if}

<style>
  /* ── Trigger: two dots, top-right of card ──────────────── */
  .cm-trigger {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 0;
    transition: background .12s;
  }
  .cm-trigger:active { background: rgba(0,0,0,.08); }

  .dot {
    display: block;
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: var(--ink-soft);
  }

  /* ── Backdrop ───────────────────────────────────────────── */
  .cm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0,0,0,.35);
  }

  /* ── Sheet ──────────────────────────────────────────────── */
  .cm-sheet {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 520px;
    z-index: 51;
    background: var(--card);
    border-radius: 20px 20px 0 0;
    padding-bottom: calc(16px + var(--safe-bottom, 0px));
    overflow: hidden;
  }

  /* ── Handle ─────────────────────────────────────────────── */
  .cm-handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--line);
    margin: 12px auto 8px;
  }

  /* ── Action rows ────────────────────────────────────────── */
  .cm-action {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 16px 24px;
    background: none;
    border: none;
    font-family: inherit;
    font-size: .95rem;
    font-weight: 600;
    color: var(--ink);
    cursor: pointer;
    text-align: left;
    transition: background .1s;
  }
  .cm-action:active { background: var(--paper-2); }
  .cm-danger { color: var(--terra); }
  .cm-action-icon { font-size: 1.1rem; }

  .cm-sep {
    height: 1px;
    background: var(--line);
    margin: 0 16px;
  }

  /* ── Confirm state ──────────────────────────────────────── */
  .cm-confirm-body {
    padding: 20px 24px 16px;
  }
  .cm-confirm-q {
    font-size: .9rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 14px;
  }
  .cm-confirm-btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cm-btn-yes {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: none;
    background: var(--terra);
    color: #fff;
    font-family: inherit;
    font-size: .9rem;
    font-weight: 700;
    cursor: pointer;
  }
  .cm-btn-no {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--paper-2);
    color: var(--ink);
    font-family: inherit;
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
  }

  /* ── Cancel row ─────────────────────────────────────────── */
  .cm-cancel {
    display: block;
    width: 100%;
    padding: 16px 24px;
    background: none;
    border: none;
    font-family: inherit;
    font-size: .95rem;
    font-weight: 600;
    color: var(--ink-soft);
    cursor: pointer;
    text-align: center;
  }
  .cm-cancel:active { background: var(--paper-2); }
</style>
