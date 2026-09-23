<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import Card        from './Card.svelte';
  import ContactInfo from '$lib/components/ui/ContactInfo.svelte';
  import Icon        from '$lib/components/ui/Icon.svelte';
  import RouteTrack  from '$lib/components/ui/RouteTrack.svelte';

  export let activity: Activity;
  export let compact   = false;
  export let past      = false;
  export let hasLabel  = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;
  $: flashing = $flashId === activity.id;
  $: hasRoute = !!(activity.meet && activity.end);

  let expanded = false;
  $: if ($flashId === activity.id) expanded = true;

  function edit()   { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<Card id={activity.id} {flashing} {past} {hasLabel} flashColor="var(--lila)" cssClass="act-card" dayDm={activity.dayDm} collapsible={!compact} bind:expanded onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>

  <!-- Badge tipo -->
  <div class="card-badge" style="color: var(--lila)">{typeInfo.label}</div>

  {#if hasRoute}
    <!-- ── Ruta salida → llegada ─────────────────────────── -->
    <div class="act-route-row">
      <div class="act-point">
        {#if activity.time}
          <span class="act-point-time font-serif">{activity.time}</span>
        {/if}
        <span class="act-point-label">Salida</span>
        <span class="act-point-name">{activity.meet}</span>
      </div>

      <RouteTrack icon="footprints" color="var(--lila)" />

      <div class="act-point right">
        {#if model.estimatedEndTime}
          <span class="act-point-time font-serif">{model.estimatedEndTime}</span>
        {/if}
        <span class="act-point-label">{model.estimatedEndTime ? 'Llegada aprox.' : 'Llegada'}</span>
        <span class="act-point-name">{activity.end}</span>
      </div>
    </div>

  {:else}
    <!-- ── Sin ruta: hora simple ─────────────────────────── -->
    {#if activity.time}
      <div class="act-time font-serif">{activity.time}</div>
    {/if}
  {/if}

  <!-- Nombre -->
  <div class="act-name">{activity.name}</div>

  <!-- Ubicación (solo cuando no hay ruta completa) -->
  {#if activity.meet && !hasRoute}
    <div class="addr-row">
      {#if model.meetUrl || model.mapsUrl}
        <a class="addr-map-btn" style="--addr-map-color: var(--lila)" href={model.meetUrl || model.mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
          <Icon name="map-pin" size={15} />
        </a>
      {:else}
        <span class="addr-map-ic" style="color: var(--lila)"><Icon name="map-pin" size={15} /></span>
      {/if}
      <span class="addr-text" style="color: var(--lila)">{activity.meet}</span>
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

    <!-- Ubicaciones con Maps -->
    {#if activity.meet || activity.end}
      <div class="card-section">
        <div class="card-section-title">
          <Icon name="map-pin" size={13} />
          Ubicaciones
        </div>
        {#if activity.meet}
          <div class="addr-row">
            {#if model.meetUrl || model.mapsUrl}
              <a class="addr-map-btn" style="--addr-map-color: var(--lila)" href={model.meetUrl || model.mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
                <Icon name="map-pin" size={15} />
              </a>
            {:else}
              <span class="addr-map-ic"><Icon name="map-pin" size={15} /></span>
            {/if}
            <span class="addr-text"><span class="addr-label-inline">Salida · </span>{activity.meet}</span>
          </div>
        {/if}
        {#if activity.end}
          <div class="addr-row">
            {#if model.endUrl}
              <a class="addr-map-btn" style="--addr-map-color: var(--lila)" href={model.endUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
                <Icon name="map-pin" size={15} />
              </a>
            {:else}
              <span class="addr-map-ic"><Icon name="map-pin" size={15} /></span>
            {/if}
            <span class="addr-text"><span class="addr-label-inline">Llegada · </span>{activity.end}</span>
          </div>
        {/if}
      </div>
    {/if}

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
  /* ── Ruta salida → llegada ──────────────────────────────────── */
  .act-route-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .act-point {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .act-point.right { align-items: flex-end; text-align: right; }

  .act-point-time {
    font-size: .9rem;
    font-weight: 600;
    color: var(--lila);
    line-height: 1;
  }

  .act-point-label {
    font-size: .72rem;
    color: var(--ink-soft);
    text-transform: uppercase;
    letter-spacing: .06em;
    font-weight: 600;
  }

  .act-point-name {
    font-size: .74rem;
    color: var(--lila);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Sin ruta: hora simple ──────────────────────────────────── */
  .act-time {
    font-size: .9rem;
    font-weight: 600;
    color: var(--lila);
    line-height: 1;
    margin-bottom: 5px;
  }

  /* ── Nombre ─────────────────────────────────────────────────── */
  .act-name {
    font-size: .88rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
    margin-bottom: 7px;
  }

  /* ── Ubicaciones en detalle ─────────────────────────────────── */
  .addr-label-inline {
    font-weight: 700;
    color: var(--lila);
    font-size: .74rem;
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
    flex: 0 0 38px; font-size: .72rem; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    color: color-mix(in srgb, var(--lila) 75%, transparent); padding-top: 2px;
  }
  .day-body  { flex: 1; }
  .day-route { font-size: .84rem; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .day-note  { font-size: .76rem; color: var(--ink-soft); margin-top: 2px; line-height: 1.3; }

  /* ── Incluye / No incluye ───────────────────────────────────── */
  .inc-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .exc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
  .exc-list li { font-size: .82rem; line-height: 1.3; display: flex; align-items: flex-start; gap: 6px; }
  .exc-list li :global(svg) { flex-shrink: 0; margin-top: 2px; }
  .exc-list-yes li { color: color-mix(in srgb, var(--jade)  90%, transparent); }
  .exc-list-no  li { color: color-mix(in srgb, var(--terra) 85%, transparent); }

  /* ── Aviso ─────────────────────────────────────────────────── */
  .exc-warn {
    display: flex; align-items: flex-start; gap: 7px;
    margin-top: 8px; font-size: .82rem; font-weight: 600;
    color: var(--gold-dark); line-height: 1.4; padding: 8px 10px;
    background: color-mix(in srgb, var(--gold) 12%, transparent); border-radius: 8px;
  }
  .exc-warn :global(svg) { flex-shrink: 0; margin-top: 2px; }
</style>
