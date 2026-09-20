<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import Card        from './Card.svelte';
  import ContactInfo from '$lib/components/ui/ContactInfo.svelte';
  import Icon, { asIcon } from '$lib/components/ui/Icon.svelte';

  export let activity: Activity;
  export let compact = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;
  $: flashing = $flashId === activity.id;

  let expanded = false;
  $: if ($flashId === activity.id) expanded = true;

  function edit()   { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<Card id={activity.id} {flashing} flashColor="var(--clay)" cssClass="act-card" dayDm={activity.dayDm} collapsible={!compact} bind:expanded onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>

  <!-- Badge: tipo + hora -->
  <div class="act-badge" style="color:{typeInfo.color}">
    {typeInfo.label}{activity.time ? ` · ${activity.time}` : ''}
    {#if activity.duration}<span class="act-dur">{activity.duration}</span>{/if}
  </div>

  <!-- Icono + nombre + fecha -->
  <div class="act-main">
    <div class="act-icon" style="background:{typeInfo.bg}; color:{typeInfo.color}">
      <Icon name={asIcon(typeInfo.icon)} size={16} />
    </div>
    <div class="act-body">
      <span class="act-name">{activity.name}</span>
      <span class="act-date">{model.dateLabel}</span>
    </div>
  </div>

  <!-- Punto de encuentro -->
  {#if activity.meet}
    <div class="addr-row">
      {#if model.meetUrl || model.mapsUrl}
        <a class="addr-map-btn" href={model.meetUrl || model.mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
          <Icon name="map-pin" size={15} />
        </a>
      {:else}
        <span class="addr-map-ic"><Icon name="map-pin" size={15} /></span>
      {/if}
      <span class="addr-text">{activity.meet}{activity.end ? ` → ${activity.end}` : ''}</span>
    </div>
  {/if}

  <!-- Pills -->
  {#if model.infoBadges.length}
    <div class="pill-line badges-row">
      {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
    </div>
  {/if}

  <!-- Detalle expandible -->
  <svelte:fragment slot="detail">

    <!-- Itinerario multi-día -->
    {#if activity.days?.length}
      <div class="card-section">
        <div class="card-section-title">Itinerario</div>
        <ol class="exc-days-list">
          {#each activity.days as d, i}
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
    {#if activity.includes?.length || activity.notIncludes?.length}
      <div class="card-section inc-grid">
        {#if activity.includes?.length}
          <div>
            <div class="card-section-title">Incluye</div>
            <ul class="exc-list exc-list-yes">
              {#each activity.includes as item}<li><Icon name="check" size={13} />{item}</li>{/each}
            </ul>
          </div>
        {/if}
        {#if activity.notIncludes?.length}
          <div>
            <div class="card-section-title">No incluye</div>
            <ul class="exc-list exc-list-no">
              {#each activity.notIncludes as item}<li><Icon name="x" size={13} />{item}</li>{/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Aviso -->
    {#if activity.warn}
      <div class="exc-warn"><Icon name="alert-triangle" size={14} />{activity.warn}</div>
    {/if}

    <ContactInfo
      tel={activity.tel || undefined}
      providerName={activity.provider || undefined}
      providerTel={activity.providerTel || undefined}
      waHref={model.waHref || undefined}
      bookingUrl={activity.bookingUrl || undefined}
    />
  </svelte:fragment>
</Card>

<style>
  /* ── Badge ─────────────────────────────────────────────────── */
  .act-badge {
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .act-dur {
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    opacity: .75;
  }

  /* ── Icono + nombre ─────────────────────────────────────────── */
  .act-main {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
  }
  .act-icon {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: grid;
    place-items: center;
  }
  .act-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 1px;
  }
  .act-name {
    font-size: .88rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
  }
  .act-date {
    font-size: .68rem;
    color: var(--ink-soft);
    font-weight: 500;
  }

  /* ── Detalle: itinerario ────────────────────────────────────── */
  .exc-days-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }
  .exc-days-list li {
    display: flex; gap: 8px; align-items: flex-start;
    padding: 6px 0; border-bottom: 1px solid var(--line);
  }
  .exc-days-list li:last-child { border-bottom: none; }
  .day-num {
    flex: 0 0 38px; font-size: .68rem; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    color: rgba(120,80,160,.75); padding-top: 2px;
  }
  .day-body  { flex: 1; }
  .day-route { font-size: .84rem; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .day-note  { font-size: .76rem; color: var(--ink-soft); margin-top: 2px; line-height: 1.3; }

  /* ── Incluye / No incluye ───────────────────────────────────── */
  .inc-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .exc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
  .exc-list li { font-size: .82rem; line-height: 1.3; display: flex; align-items: flex-start; gap: 6px; }
  .exc-list li :global(svg) { flex-shrink: 0; margin-top: 2px; }
  .exc-list-yes li { color: rgba(63,125,100,.9); }
  .exc-list-no  li { color: rgba(198,90,52,.85); }

  /* ── Aviso ─────────────────────────────────────────────────── */
  .exc-warn {
    display: flex; align-items: flex-start; gap: 7px;
    margin-top: 8px; font-size: .82rem; font-weight: 600;
    color: #9a6b12; line-height: 1.4; padding: 8px 10px;
    background: rgba(224,168,62,.12); border-radius: 8px;
  }
  .exc-warn :global(svg) { flex-shrink: 0; margin-top: 2px; }
</style>
