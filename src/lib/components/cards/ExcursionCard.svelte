<script lang="ts">
  import type { Excursion } from '$lib/models/types';
  import { ExcursionModel } from '$lib/models/ExcursionModel';
  import { flashId } from '$lib/stores/ui';
  import CardHeader      from './CardHeader.svelte';
  import IconWhatsApp    from '$lib/components/ui/IconWhatsApp.svelte';

  export let excursion: Excursion;

  $: model    = new ExcursionModel(excursion);
  $: flashing = $flashId === excursion.id;
</script>

<div id={excursion.id} class="card exc-card" class:flash={flashing}>

  <CardHeader
    icon="🥾"
    type="Excursión · {excursion.time} ({excursion.duration}) · {model.dateLabel}"
    name={excursion.name}
    place="📍 {excursion.meet}{excursion.end ? ` → 🏁 ${excursion.end}` : ''}"
  >
    <svelte:fragment slot="pills">
      <div class="pill-line badge-row">
        <span class="pill pill-green">🎫 {excursion.bookingCode}</span>
        <span class="pill pill-info">{excursion.price} · 2 pax</span>
      </div>
    </svelte:fragment>
  </CardHeader>

  <!-- Itinerario día a día (excursiones multi-día) -->
  {#if excursion.days?.length}
    <div class="card-section">
      <div class="card-section-title">Itinerario</div>
      <ol class="exc-days-list">
        {#each excursion.days as d, i}
          <li>
            <span class="day-num">Día {i + 1}</span>
            <div class="day-body">
              <div class="day-route">{d.title}</div>
              {#if d.sub}<div class="day-note">{d.sub}</div>{/if}
            </div>
          </li>
        {/each}
      </ol>
    </div>
  {/if}

  <!-- Incluye / No incluye -->
  {#if excursion.includes.length}
    <div class="card-section">
      <div class="card-section-title">Incluye</div>
      <ul class="exc-list exc-list-yes">
        {#each excursion.includes as item}<li>✓ {item}</li>{/each}
      </ul>
    </div>
  {/if}

  {#if excursion.notIncludes.length}
    <div class="card-section">
      <div class="card-section-title">No incluye</div>
      <ul class="exc-list exc-list-no">
        {#each excursion.notIncludes as item}<li>✗ {item}</li>{/each}
      </ul>
    </div>
  {/if}

  <!-- Notas y avisos -->
  {#if excursion.note}
    <div class="exc-note">{excursion.note}</div>
  {/if}

  {#if excursion.warn}
    <div class="exc-warn">⚠ {excursion.warn}</div>
  {/if}

  <!-- Acciones -->
  <div class="row-actions">
    {#if model.meetUrl}
      <a class="maps" href={model.meetUrl} target="_blank" rel="noreferrer">📍 Mapa inicio</a>
    {/if}
    {#if model.endUrl}
      <a class="maps" href={model.endUrl} target="_blank" rel="noreferrer">🏁 Mapa fin</a>
    {/if}
    <a class="call" href={model.telHref}>📞 {excursion.provider}</a>
    <a class="btn-nav wa" href={model.waHref} target="_blank" rel="noreferrer"><IconWhatsApp /> WhatsApp</a>
  </div>

</div>

<style>
  .exc-card { --flash-color: rgba(120,80,160,.7); }

  .wa { background: transparent; color: #128c4a; border-color: rgba(18,140,74,.3); }

  .badge-row { margin-top: 5px; }

  /* Itinerario */
  .exc-days-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
  }
  .exc-days-list li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 5px 0;
    border-bottom: 1px solid var(--line);
  }
  .exc-days-list li:last-child { border-bottom: none; }

  .day-num {
    flex: 0 0 38px;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: rgba(120,80,160,.75);
    padding-top: 2px;
  }
  .day-body { flex: 1; }
  .day-route { font-size: .77rem; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .day-note  { font-size: .67rem; color: var(--ink-soft); margin-top: 2px; line-height: 1.3; }

  /* Listas */
  .exc-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .exc-list li { font-size: .76rem; line-height: 1.3; }
  .exc-list-yes li { color: rgba(63,125,100,.9); }
  .exc-list-no  li { color: rgba(198,90,52,.85); }

  /* Nota y aviso */
  .exc-note {
    margin-top: 8px;
    font-size: .74rem;
    color: var(--ink-soft);
    line-height: 1.4;
    padding: 6px 8px;
    background: var(--paper-2);
    border-radius: 6px;
  }
  .exc-warn {
    margin-top: 6px;
    font-size: .74rem;
    font-weight: 600;
    color: #9a6b12;
    line-height: 1.4;
    padding: 6px 8px;
    background: rgba(224,168,62,.12);
    border-radius: 6px;
  }
</style>
