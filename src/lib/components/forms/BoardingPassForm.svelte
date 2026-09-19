<script lang="ts">
  import { bpModal, closeBpModal } from '$lib/stores/ui';
  import { saveBoardingPass } from '$lib/stores/trip';
  import { getBpImage, setBpImage, removeBpImage, fileToDataUrl } from '$lib/utils/bpStorage';
  import { onMount } from 'svelte';

  const TRAVELER_LABEL: Record<string, string> = { pepe: 'Pepe', sunta: 'Sunta' };

  let seat        = '';
  let gate        = '';
  let terminal    = '';
  let boardingTime = '';
  let locator     = '';
  let imagePreview: string | null = null;
  let imageChanged = false;
  let saving = false;

  $: flight     = $bpModal.flight;
  $: travelerId = $bpModal.travelerId;
  $: existing   = $bpModal.existing;

  onMount(() => {
    if (existing) {
      seat         = existing.seat         ?? '';
      gate         = existing.gate         ?? '';
      terminal     = existing.terminal     ?? '';
      boardingTime = existing.boardingTime ?? '';
      locator      = existing.locator      ?? '';
    }
    if (flight && travelerId) {
      imagePreview = getBpImage(flight.id, travelerId);
    }
  });

  async function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    imagePreview = await fileToDataUrl(file);
    imageChanged = true;
  }

  function removeImage() {
    imagePreview = null;
    imageChanged = true;
  }

  async function submit() {
    if (!flight || !travelerId) return;
    saving = true;
    try {
      if (imageChanged) {
        if (imagePreview) setBpImage(flight.id, travelerId, imagePreview);
        else removeBpImage(flight.id, travelerId);
      }
      await saveBoardingPass(flight.id, {
        travelerId,
        seat:         seat.trim()         || undefined,
        gate:         gate.trim()         || undefined,
        terminal:     terminal.trim()     || undefined,
        boardingTime: boardingTime.trim() || undefined,
        locator:      locator.trim()      || undefined,
      });
      closeBpModal();
    } finally {
      saving = false;
    }
  }
</script>

<h2 class="form-title">
  🎫 Tarjeta de embarque
  {#if travelerId}<span class="traveler-chip">{TRAVELER_LABEL[travelerId]}</span>{/if}
</h2>

{#if flight}
  <p class="flight-ref">{flight.from} → {flight.to} · {flight.dep} · {flight.airline}</p>
{/if}

<form on:submit|preventDefault={submit} class="form">
  <div class="row-2">
    <label class="field">
      <span>Localizador</span>
      <input type="text" bind:value={locator} placeholder="AB1234" autocapitalize="characters" />
    </label>
    <label class="field">
      <span>Terminal</span>
      <input type="text" bind:value={terminal} placeholder="T1" />
    </label>
  </div>

  <div class="row-2">
    <label class="field">
      <span>Puerta</span>
      <input type="text" bind:value={gate} placeholder="B12" />
    </label>
    <label class="field">
      <span>Embarque</span>
      <input type="text" bind:value={boardingTime} placeholder="10:30" />
    </label>
  </div>

  <label class="field">
    <span>Asiento</span>
    <input type="text" bind:value={seat} placeholder="23A" autocapitalize="characters" />
  </label>

  <!-- Image section -->
  <div class="field">
    <span>Foto / QR</span>
    {#if imagePreview}
      <div class="img-preview-wrap">
        <img src={imagePreview} alt="Tarjeta de embarque" class="img-preview" />
        <button type="button" class="img-remove" on:click={removeImage}>✕</button>
      </div>
    {:else}
      <label class="img-upload-btn">
        <input type="file" accept="image/*" capture="environment" on:change={onFileChange} />
        <span>📷 Añadir foto</span>
      </label>
    {/if}
  </div>

  <div class="form-footer">
    <button type="button" class="btn btn-outline" on:click={closeBpModal}>Cancelar</button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Guardando…' : 'Guardar'}
    </button>
  </div>
</form>

<style>
  .form-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .traveler-chip {
    font-size: .72rem;
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 99px;
    padding: 2px 10px;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .flight-ref {
    font-size: .72rem;
    color: var(--ink-soft);
    margin-bottom: 14px;
  }
  /* ── Image ─────────────────────────────────────────────── */
  .img-preview-wrap {
    position: relative;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--line);
  }
  .img-preview {
    width: 100%;
    display: block;
    max-height: 220px;
    object-fit: contain;
    background: var(--paper-2);
  }
  .img-remove {
    position: absolute;
    top: 6px; right: 6px;
    background: rgba(0,0,0,.55);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 26px; height: 26px;
    font-size: .8rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .img-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    border: 1.5px dashed var(--line);
    border-radius: 10px;
    cursor: pointer;
    color: var(--ink-soft);
    font-size: .84rem;
    font-weight: 600;
    transition: border-color .15s;
  }
  .img-upload-btn:active { border-color: var(--clay); }
  .img-upload-btn input { display: none; }
</style>
