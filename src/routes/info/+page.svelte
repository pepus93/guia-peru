<script lang="ts">
  import { travelerList, loading } from '$lib/stores/trip';
  import Icon      from '$lib/components/ui/Icon.svelte';
  import PageTitle from '$lib/components/ui/PageTitle.svelte';
</script>

<PageTitle title="Info" eyebrow="Perú 2026" accent="var(--terra)" />

<!-- ── VIAJEROS ──────────────────────────────────────────────── -->
<div class="section-label">Viajeros</div>

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else}
  {#each $travelerList as t (t.id)}
    <div class="traveler-card">
      <div class="traveler-name">{t.name} <span class="flag">🇪🇸</span></div>
      <div class="traveler-row"><span>DNI</span><strong>{t.dni}</strong><span class="val-date">válido hasta {t.dniValid}</span></div>
      <div class="traveler-row"><span>Pasaporte</span><strong>{t.passport}</strong><span class="val-date">válido hasta {t.passportValid}</span></div>
      <div class="traveler-row"><span>Nacimiento</span><strong>{t.born}</strong></div>
    </div>
  {/each}
{/if}

<!-- ── SEGURO MÉDICO ─────────────────────────────────────────── -->
<div class="section-label" style="margin-top: 28px">Seguro médico</div>

<div class="insurance-card">
  <div class="ins-header">
    <div>
      <div class="ins-product">IATI Backpacker · ARAG</div>
      <div class="ins-period">9 – 25 octubre 2026 · 17 días · 2 viajeros</div>
    </div>
    <div class="ins-amount">191,76 €</div>
  </div>

  <div class="ins-data-grid">
    <div class="ins-field"><span>Nº Póliza</span><strong>471346516</strong></div>
    <div class="ins-field"><span>Nº Viaje</span><strong>001649556</strong></div>
    <div class="ins-field"><span>Cobertura</span><strong>Mundial</strong></div>
    <div class="ins-field"><span>Deporte aventura</span><strong>Incluido ✓</strong></div>
  </div>

  <div class="ins-divider"></div>

  <div class="ins-coverages-title">Coberturas principales</div>
  <div class="ins-coverages">
    <div class="ins-cov-row key"><span>Asistencia médica mundial</span><strong>1.500.000 €</strong></div>
    <div class="ins-cov-row key"><span>Búsqueda y rescate</span><strong>15.000 €</strong></div>
    <div class="ins-cov-row key"><span>Repatriación</span><strong>100%</strong></div>
    <div class="ins-cov-row"><span>Robo equipaje</span><strong>3.000 €</strong></div>
    <div class="ins-cov-row"><span>Electrónica robada</span><strong>1.800 €</strong></div>
    <div class="ins-cov-row"><span>Gastos dentales</span><strong>350 €</strong></div>
    <div class="ins-cov-row"><span>Responsabilidad civil</span><strong>60.000 €</strong></div>
    <div class="ins-cov-row"><span>Equipaje facturado demorado</span><strong>300 €</strong></div>
  </div>

  <div class="ins-divider"></div>

  <div class="ins-coverages-title">Contacto de emergencia (24h)</div>
  <div class="ins-contacts">
    <a class="ins-contact-btn call" href="tel:+34934857735">
      <Icon name="phone" size={16} /><span>+34 93 485 77 35</span><small>Teléfono 24h</small>
    </a>
    <a class="ins-contact-btn wa" href="https://wa.me/34673885576" target="_blank" rel="noreferrer">
      <Icon name="message-circle" size={16} /><span>+34 673 885 576</span><small>WhatsApp</small>
    </a>
    <a class="ins-contact-btn mail" href="mailto:iatimedicos@arag.es">
      <Icon name="mail" size={16} /><span>iatimedicos@arag.es</span><small>Email urgencias</small>
    </a>
  </div>

  <div class="ins-divider"></div>

  <div class="ins-coverages-title">Documentos</div>
  <div class="ins-docs">
    <a class="ins-doc-btn" href="/docs/seguro_certificado.pdf" download="Certificado_Seguro_IATI.pdf">
      <Icon name="file" size={15} /> Certificado de seguro
    </a>
    <a class="ins-doc-btn" href="/docs/seguro_poliza.pdf" download="Poliza_IATI_Backpacker.pdf">
      <Icon name="file-text" size={15} /> Póliza completa
    </a>
  </div>
</div>

<!-- ── EMERGENCIAS PERÚ ──────────────────────────────────────── -->
<div class="section-label" style="margin-top: 28px">Emergencias en Perú</div>

<div class="info-card">
  <a class="emerg-row" href="tel:117">
    <span class="emerg-icon"><Icon name="alert-circle" size={20} /></span>
    <div class="emerg-body"><strong>117</strong><span>Emergencias médicas (SAMU)</span></div>
  </a>
  <a class="emerg-row" href="tel:105">
    <span class="emerg-icon"><Icon name="shield" size={20} /></span>
    <div class="emerg-body"><strong>105</strong><span>Policía Nacional</span></div>
  </a>
  <a class="emerg-row" href="tel:116">
    <span class="emerg-icon"><Icon name="flame" size={20} /></span>
    <div class="emerg-body"><strong>116</strong><span>Bomberos</span></div>
  </a>
  <a class="emerg-row" href="tel:0800441111">
    <span class="emerg-icon"><Icon name="flag" size={20} /></span>
    <div class="emerg-body"><strong>0800-44-1111</strong><span>Embajada española en Lima</span></div>
  </a>
  <a class="emerg-row" href="tel:080022100">
    <span class="emerg-icon"><Icon name="info" size={20} /></span>
    <div class="emerg-body"><strong>0800-22-100</strong><span>iPerú — Atención al turista (gratuito)</span></div>
  </a>
  <a class="emerg-row" href="tel:+5114765165">
    <span class="emerg-icon"><Icon name="alert-triangle" size={20} /></span>
    <div class="emerg-body"><strong>+51 1 476 5165</strong><span>INDECI — Defensa Civil</span></div>
  </a>
</div>

<!-- ── INFO ÚTIL ─────────────────────────────────────────────── -->
<div class="section-label" style="margin-top: 28px">Información útil</div>

<div class="info-card">
  <div class="info-row"><Icon name="credit-card" size={15} /><span>Moneda: Sol peruano (PEN). 1€ ≈ 4.1 PEN</span></div>
  <div class="info-row"><Icon name="wifi" size={15} /><span>SIM local en aeropuerto. Operadoras: Bitel, Claro, Entel</span></div>
  <div class="info-row"><Icon name="thermometer" size={15} /><span>Lima: 18–22°C. Cusco: 5–18°C. Selva: 25–35°C</span></div>
  <div class="info-row"><Icon name="zap" size={15} /><span>Repelente obligatorio en la selva. Malaria baja altitud</span></div>
  <div class="info-row"><Icon name="pill" size={15} /><span>Soroche (mal de altura): ibuprofeno + hidratación + descanso</span></div>
  <div class="info-row"><Icon name="mountain" size={15} /><span>Cusco: 3400 m. Primeras 24h ritmo tranquilo</span></div>
</div>

<p class="foot">Perú 2026 · Pepe & Sunta</p>

<style>
  /* ── Viajeros ── */
  .traveler-card {
    background: var(--card);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    margin-bottom: 10px;
    box-shadow: var(--shadow-sm);
  }
  .traveler-name {
    font-size: 1rem; font-weight: 700; margin-bottom: 8px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .flag { font-size: 1.3rem; }
  .traveler-row {
    display: flex; align-items: center; gap: 8px;
    font-size: .82rem; padding: 4px 0;
    border-top: 1px solid var(--line);
  }
  .traveler-row span:first-child { color: var(--ink-soft); min-width: 80px; }
  .val-date { color: var(--ink-soft); font-size: .72rem; }

  /* ── Seguro ── */
  .insurance-card {
    background: var(--card);
    border-radius: var(--radius-md);
    padding: 16px;
    box-shadow: var(--shadow-sm);
  }
  .ins-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 12px;
  }
  .ins-product { font-size: .94rem; font-weight: 700; color: var(--ink); }
  .ins-period  { font-size: .76rem; color: var(--ink-soft); margin-top: 2px; }
  .ins-amount  { font-size: 1rem; font-weight: 700; color: var(--jade); white-space: nowrap; }

  .ins-data-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px;
    margin-bottom: 12px;
  }
  .ins-field { display: flex; flex-direction: column; gap: 1px; }
  .ins-field span { font-size: .7rem; color: var(--ink-soft); text-transform: uppercase; letter-spacing: .05em; }
  .ins-field strong { font-size: .84rem; color: var(--ink); }

  .ins-divider { height: 1px; background: var(--line); margin: 12px 0; }

  .ins-coverages-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--ink-soft); margin-bottom: 8px; }
  .ins-coverages { display: flex; flex-direction: column; gap: 4px; }
  .ins-cov-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: .82rem; padding: 3px 0;
    border-bottom: 1px solid var(--line);
  }
  .ins-cov-row:last-child { border-bottom: none; }
  .ins-cov-row span { color: var(--ink-soft); }
  .ins-cov-row strong { color: var(--ink); font-weight: 600; }
  .ins-cov-row.key strong { color: var(--jade); font-weight: 700; }
  .ins-cov-row.key span  { color: var(--ink); font-weight: 600; }

  .ins-contacts { display: flex; flex-direction: column; gap: 8px; }
  .ins-contact-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    text-decoration: none; font-family: inherit;
  }
  .ins-contact-btn span { font-size: .9rem; font-weight: 700; flex: 1; }
  .ins-contact-btn small { font-size: .72rem; color: inherit; opacity: .7; }
  .ins-contact-btn.call { background: rgba(63,125,100,.12); color: var(--jade); }
  .ins-contact-btn.wa   { background: rgba(37,211,102,.12); color: #1a7a3c; }
  .ins-contact-btn.mail { background: rgba(58,110,165,.12); color: var(--sky); }

  .ins-docs { display: flex; gap: 8px; flex-wrap: wrap; }
  .ins-doc-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: var(--radius-sm);
    background: var(--paper-2); border: 1px solid var(--line);
    color: var(--ink); font-size: .84rem; font-weight: 600;
    text-decoration: none;
  }
  .ins-doc-btn:active { background: var(--ink); color: var(--paper); }

  /* ── Emergencias ── */
  .info-card {
    background: var(--card);
    border-radius: var(--radius-md);
    padding: 4px 14px;
    box-shadow: var(--shadow-sm);
  }
  .emerg-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--line);
    text-decoration: none; color: var(--ink);
  }
  .emerg-row:last-child { border-bottom: none; }
  .emerg-icon { display: flex; align-items: center; flex: 0 0 auto; }
  .emerg-body { flex: 1; display: flex; flex-direction: column; gap: 1px; }
  .emerg-body strong { font-size: .92rem; font-weight: 700; }
  .emerg-body span   { font-size: .76rem; color: var(--ink-soft); }

  /* ── Info útil ── */
  .info-row {
    display: flex; align-items: center; gap: 10px; font-size: .84rem;
    padding: 7px 0; border-bottom: 1px solid var(--line);
    color: var(--ink-soft);
  }
  .info-row :global(svg) { flex-shrink: 0; }
  .info-row:last-child { border-bottom: none; }
</style>
