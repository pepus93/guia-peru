<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '$lib/components/ui/Icon.svelte';

  const DEFAULT_RATE = 4.10;
  const QUICK_EUR    = [1, 5, 10, 20, 50, 100];

  const REFERENCES = [
    { label: 'Menú del día (2-3 platos)',  pen: 12 },
    { label: 'Taxi corto en Cusco',        pen: 8  },
    { label: 'Cerveza 330ml',              pen: 10 },
    { label: 'Agua 1,5L',                  pen: 3  },
    { label: 'Entrada Machu Picchu',       pen: 152 },
    { label: 'Ceviche en restaurante',     pen: 35 },
    { label: 'Café con leche',             pen: 8  },
  ];

  let rate  = DEFAULT_RATE;
  let eurVal = '';
  let penVal = '';

  onMount(() => {
    const saved = localStorage.getItem('eur_pen_rate');
    if (saved) rate = parseFloat(saved);
  });

  function onEurInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    eurVal = v;
    const n = parseFloat(v);
    penVal = isNaN(n) ? '' : (n * rate).toFixed(2);
  }

  function onPenInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    penVal = v;
    const n = parseFloat(v);
    eurVal = isNaN(n) ? '' : (n / rate).toFixed(2);
  }

  function onRateChange(e: Event) {
    const n = parseFloat((e.target as HTMLInputElement).value);
    if (n > 0) {
      rate = n;
      localStorage.setItem('eur_pen_rate', String(n));
      if (eurVal) penVal = (parseFloat(eurVal) * rate).toFixed(2);
    }
  }

  function setQuick(eur: number) {
    eurVal = String(eur);
    penVal = (eur * rate).toFixed(2);
  }

  function eurFromPen(pen: number): string {
    return (pen / rate).toFixed(2);
  }
</script>

<div class="section-label">Calculadora de cambio</div>

<div class="converter-card">
  <h2 class="conv-title font-serif"><Icon name="arrow-left-right" size={18} /> EUR ↔ PEN</h2>

  <!-- Main converter -->
  <div class="conv-row">
    <div class="conv-field">
      <label for="eur-in">Euros €</label>
      <input
        id="eur-in"
        type="number"
        inputmode="decimal"
        placeholder="0"
        value={eurVal}
        on:input={onEurInput}
      />
    </div>
    <div class="conv-sep">⇄</div>
    <div class="conv-field">
      <label for="pen-in">Soles S/</label>
      <input
        id="pen-in"
        type="number"
        inputmode="decimal"
        placeholder="0"
        value={penVal}
        on:input={onPenInput}
      />
    </div>
  </div>

  <!-- Rate editor -->
  <div class="rate-row">
    <span class="rate-label">Tipo de cambio:</span>
    <span class="rate-value">1 € =</span>
    <input
      class="rate-input"
      type="number"
      step="0.01"
      inputmode="decimal"
      value={rate}
      on:change={onRateChange}
    />
    <span class="rate-value">S/</span>
    <span class="rate-hint">(editable · se guarda)</span>
  </div>

  <!-- Quick amounts -->
  <div class="quick-label">Rápido:</div>
  <div class="quick-row">
    {#each QUICK_EUR as q}
      <button class="quick-btn" on:click={() => setQuick(q)}>{q}€</button>
    {/each}
  </div>
</div>

<!-- Reference prices -->
<div class="section-label">Precios de referencia</div>

<div class="ref-card">
  {#each REFERENCES as r}
    <div class="ref-row">
      <span class="ref-label">{r.label}</span>
      <span class="ref-pen">{r.pen} S/</span>
      <span class="ref-eur">~{eurFromPen(r.pen)}€</span>
    </div>
  {/each}
</div>

<!-- Info tip -->
<div class="tip-card">
  <p><Icon name="credit-card" size={14} /> Cambia euros en las <strong>casas de cambio</strong> de la calle. Mejor tipo que cajeros. Evita el aeropuerto.</p>
  <p><Icon name="credit-card" size={14} /> Cajeros: <strong>BCP</strong> e <strong>Interbank</strong> tienen las comisiones más bajas.</p>
  <p><Icon name="wifi" size={14} /> El tipo de cambio real lo puedes ver en la app <strong>XE Currency</strong> cuando tengas WiFi.</p>
</div>

<p class="foot">El tipo de cambio se guarda en el dispositivo · funciona sin conexión</p>

<style>
  .converter-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 12px;
    box-shadow: var(--shadow);
  }

  .conv-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* ── Main converter ─────────────────────────────────────── */
  .conv-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: end;
  }

  .conv-field label {
    display: block;
    font-size: .66rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 5px;
  }

  .conv-field input {
    width: 100%;
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--ink);
    outline: none;
    transition: .15s;
  }
  .conv-field input:focus { border-color: var(--clay); background: var(--paper); }

  .conv-sep {
    font-size: 1.2rem;
    color: var(--ink-soft);
    text-align: center;
    padding-bottom: 12px;
  }

  /* ── Rate row ───────────────────────────────────────────── */
  .rate-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 14px;
  }

  .rate-label { font-size: .72rem; color: var(--ink-soft); font-weight: 600; }
  .rate-value { font-size: .82rem; font-weight: 700; color: var(--ink); }
  .rate-hint  { font-size: .66rem; color: var(--ink-soft); }

  .rate-input {
    width: 72px;
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 5px 8px;
    font-family: inherit;
    font-size: .9rem;
    font-weight: 700;
    color: var(--ink);
    outline: none;
    text-align: center;
  }
  .rate-input:focus { border-color: var(--clay); }

  /* ── Quick amounts ──────────────────────────────────────── */
  .quick-label {
    font-size: .66rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 600;
    margin-top: 14px;
    margin-bottom: 7px;
  }

  .quick-row { display: flex; gap: 6px; flex-wrap: wrap; }

  .quick-btn {
    flex: 0 0 auto;
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 6px 13px;
    font-family: inherit;
    font-size: .82rem;
    font-weight: 700;
    color: var(--ink);
    cursor: pointer;
    transition: .15s;
  }
  .quick-btn:active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

  /* ── Reference prices ───────────────────────────────────── */
  .ref-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 4px 16px;
    margin-bottom: 12px;
    box-shadow: var(--shadow);
  }

  .ref-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }
  .ref-row:last-child { border-bottom: none; }

  .ref-label { flex: 1; font-size: .82rem; color: var(--ink-soft); }
  .ref-pen   { font-size: .82rem; font-weight: 700; color: var(--ink); min-width: 52px; text-align: right; }
  .ref-eur   { font-size: .78rem; font-weight: 600; color: var(--jade); min-width: 48px; text-align: right; }

  /* ── Tips ───────────────────────────────────────────────── */
  .tip-card {
    background: rgba(63,125,100,.07);
    border: 1px solid rgba(63,125,100,.18);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  .tip-card p { font-size: .8rem; color: var(--ink-soft); line-height: 1.45; display: flex; align-items: flex-start; gap: 8px; }
  .tip-card p :global(svg) { flex-shrink: 0; margin-top: 1px; }
  .tip-card strong { color: var(--ink); }
</style>
