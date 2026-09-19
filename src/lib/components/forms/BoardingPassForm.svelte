<script lang="ts">
  import { onMount } from 'svelte';
  import { bpModal, closeBpModal } from '$lib/stores/ui';
  import { saveBoardingPass } from '$lib/stores/trip';
  import { getBpImage, setBpImage, removeBpImage, fileToDataUrl } from '$lib/utils/bpStorage';

  const TRAVELER_LABEL: Record<string, string> = { pepe: 'Pepe', sunta: 'Sunta' };

  $: flight     = $bpModal.flight;
  $: travelerId = $bpModal.travelerId;
  $: existing   = $bpModal.existing;

  let imagePreview: string | null = null;
  let imageChanged = false;
  let saving = false;

  onMount(() => {
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
      await saveBoardingPass(flight.id, { travelerId });
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
  <div class="photo-zone">
    {#if imagePreview}
      <div class="img-preview-wrap">
        <img src={imagePreview} alt="Tarjeta de embarque" class="img-preview" />
        <button type="button" class="img-remove" on:click={removeImage} title="Eliminar foto">✕</button>
        <label class="img-change-btn" title="Cambiar foto">
          📷
          <input type="file" accept="image/*" on:change={onFileChange} />
        </label>
      </div>
    {:else}
      <label class="img-upload-btn">
        <input type="file" accept="image/*" on:change={onFileChange} />
        <div class="upload-inner">
          <span class="upload-icon">📷</span>
          <span class="upload-label">Añadir foto del boarding pass</span>
          <span class="upload-hint">Para consultar el QR en el aeropuerto</span>
        </div>
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
    font-size: 1rem; font-weight: 700; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .traveler-chip {
    font-size: .78rem; background: var(--paper-2); border: 1px solid var(--line);
    border-radius: 99px; padding: 2px 10px; font-weight: 600; color: var(--ink-soft);
  }
  .flight-ref { font-size: .78rem; color: var(--ink-soft); margin-bottom: 16px; }

  .form { display: flex; flex-direction: column; gap: 16px; }

  .photo-zone { width: 100%; }

  .img-preview-wrap {
    position: relative; width: 100%; border-radius: 12px;
    overflow: hidden; border: 1px solid var(--line);
  }
  .img-preview {
    width: 100%; display: block;
    max-height: 300px;
    object-fit: contain; background: #000;
  }
  .img-remove {
    position: absolute; top: 8px; right: 8px;
    background: rgba(0,0,0,.65); color: #fff; border: none;
    border-radius: 50%; width: 30px; height: 30px;
    font-size: .9rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .img-change-btn {
    position: absolute; bottom: 8px; right: 8px;
    background: rgba(0,0,0,.65); color: #fff; border: none;
    border-radius: 8px; width: 34px; height: 34px;
    font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .img-change-btn input { display: none; }

  .img-upload-btn {
    display: block; cursor: pointer;
    border: 2px dashed var(--line); border-radius: 12px;
    transition: border-color .15s;
  }
  .img-upload-btn:active { border-color: var(--clay); }
  .img-upload-btn input { display: none; }

  .upload-inner {
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; padding: 32px 20px;
  }
  .upload-icon { font-size: 2rem; }
  .upload-label { font-size: .9rem; font-weight: 700; color: var(--ink); }
  .upload-hint  { font-size: .78rem; color: var(--ink-soft); text-align: center; }
</style>
