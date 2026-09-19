<script lang="ts">
  import { travelerList, loading } from '$lib/stores/trip';
</script>

<div class="section-label">Viajeros</div>

{#if $loading}
  <p class="loading-msg">Cargando…</p>
{:else}
  {#each $travelerList as t (t.id)}
    <div class="traveler-card">
      <div class="traveler-name">{t.name} <span class="nickname">({t.nickname})</span></div>
      <div class="traveler-row"><span>DNI</span><strong>{t.dni}</strong><span class="val-date">válido hasta {t.dniValid}</span></div>
      <div class="traveler-row"><span>Pasaporte</span><strong>{t.passport}</strong><span class="val-date">válido hasta {t.passportValid}</span></div>
      <div class="traveler-row"><span>Nacimiento</span><strong>{t.born}</strong></div>
    </div>
  {/each}
{/if}

<div class="section-label" style="margin-top: 28px">Información útil</div>

<div class="info-card">
  <div class="info-row">🏧 <span>Moneda: Sol peruano (PEN). 1€ ≈ 4.1 PEN</span></div>
  <div class="info-row">📶 <span>SIM local en aeropuerto. Operadoras: Bitel, Claro, Entel</span></div>
  <div class="info-row">🌡 <span>Lima: 18–22°C. Cusco: 5–18°C. Selva: 25–35°C</span></div>
  <div class="info-row">🦟 <span>Repelente obligatorio en la selva. Malaria baja altitud</span></div>
  <div class="info-row">💊 <span>Soroche (mal de altura): ibuprofeno + hidratación + descanso</span></div>
  <div class="info-row">🚑 <span>Emergencias: 117 (médico) · 105 (policía) · 116 (bomberos)</span></div>
  <div class="info-row">🏔 <span>Cusco: 3400 m. Primeras 24h ritmo tranquilo</span></div>
</div>

<p class="foot">Perú 2026 · Pepe & Sunta</p>

<style>
  .loading-msg { text-align: center; color: var(--ink-soft); padding: 40px 0; font-size: .85rem; }

  .traveler-card {
    background: var(--card);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    margin-bottom: 10px;
    box-shadow: var(--shadow-sm);
  }

  .traveler-name { font-size: .95rem; font-weight: 700; margin-bottom: 8px; }
  .nickname { font-weight: 400; color: var(--ink-soft); }

  .traveler-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .78rem;
    padding: 3px 0;
    border-top: 1px solid var(--line);
  }
  .traveler-row span:first-child { color: var(--ink-soft); min-width: 80px; }
  .val-date { color: var(--ink-soft); font-size: .68rem; }

  .info-card {
    background: var(--card);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    box-shadow: var(--shadow-sm);
  }

  .info-row {
    display: flex;
    gap: 10px;
    font-size: .8rem;
    padding: 6px 0;
    border-bottom: 1px solid var(--line);
    color: var(--ink-soft);
  }
  .info-row:last-child { border-bottom: none; }
</style>
