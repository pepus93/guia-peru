<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import CardHeader   from './CardHeader.svelte';
  import CardMenu     from './CardMenu.svelte';
  import Card         from './Card.svelte';
  import IconWhatsApp from '$lib/components/ui/IconWhatsApp.svelte';

  export let activity: Activity;
  export let compact = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;
  $: flashing = $flashId === activity.id;

  function edit() { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<Card id={activity.id} {flashing} flashColor="var(--clay)" cssClass="act-card" dayDm={activity.dayDm}>
  <CardHeader
    icon={typeInfo.icon}
    type="{typeInfo.label}{activity.time ? ` · ${activity.time}` : ''}{activity.duration ? ` (${activity.duration})` : ''} · {model.dateLabel}"
    name={activity.name}
    place={activity.meet ? `📍 ${activity.meet}${activity.end ? ` → 🏁 ${activity.end}` : ''}` : ''}
  >
    <svelte:fragment slot="pills">
      {#if model.infoBadges.length}
        <div class="pill-line badges-row">
          {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
        </div>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="menu">
      {#if !compact}<CardMenu onEdit={edit} onDelete={remove} />{/if}
    </svelte:fragment>
  </CardHeader>

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

  <!-- Incluye -->
  {#if activity.includes?.length}
    <div class="card-section">
      <div class="card-section-title">Incluye</div>
      <ul class="exc-list exc-list-yes">
        {#each activity.includes as item}<li>✓ {item}</li>{/each}
      </ul>
    </div>
  {/if}

  <!-- No incluye -->
  {#if activity.notIncludes?.length}
    <div class="card-section">
      <div class="card-section-title">No incluye</div>
      <ul class="exc-list exc-list-no">
        {#each activity.notIncludes as item}<li>✗ {item}</li>{/each}
      </ul>
    </div>
  {/if}

  <!-- Aviso -->
  {#if activity.warn}
    <div class="exc-warn">⚠ {activity.warn}</div>
  {/if}

  <div class="row-actions">
    {#if model.meetUrl}
      <a class="maps" href={model.meetUrl} target="_blank" rel="noreferrer">📍 Mapa inicio</a>
    {/if}
    {#if model.endUrl}
      <a class="maps" href={model.endUrl} target="_blank" rel="noreferrer">🏁 Mapa fin</a>
    {/if}
    {#if model.mapsUrl && !model.meetUrl}
      <a class="maps" href={model.mapsUrl} target="_blank" rel="noreferrer">📍 Mapa</a>
    {/if}
    {#if activity.tel}
      <a class="call" href="tel:{activity.tel}">📞 Llamar</a>
    {/if}
    {#if activity.providerTel}
      <a class="call" href={model.telHref}>📞 {activity.provider ?? 'Proveedor'}</a>
      <a class="btn-nav wa" href={model.waHref} target="_blank" rel="noreferrer"><IconWhatsApp /> WhatsApp</a>
    {/if}
    {#if activity.bookingUrl}
      <a class="btn-nav" href={activity.bookingUrl} target="_blank" rel="noreferrer">🎫 Ver reserva</a>
    {/if}
  </div>
</Card>

<style>
  .badges-row { margin-top: 5px; }

  .wa { background: transparent; color: #128c4a; border-color: rgba(18,140,74,.3); }

  /* Itinerario */
  .exc-days-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }
  .exc-days-list li {
    display: flex; gap: 8px; align-items: flex-start;
    padding: 5px 0; border-bottom: 1px solid var(--line);
  }
  .exc-days-list li:last-child { border-bottom: none; }
  .day-num {
    flex: 0 0 38px; font-size: .7rem; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    color: rgba(120,80,160,.75); padding-top: 2px;
  }
  .day-body { flex: 1; }
  .day-route { font-size: .84rem; font-weight: 600; color: var(--ink); line-height: 1.3; }
  .day-note  { font-size: .76rem; color: var(--ink-soft); margin-top: 2px; line-height: 1.3; }

  /* Listas incluye/no incluye */
  .exc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
  .exc-list li { font-size: .84rem; line-height: 1.3; }
  .exc-list-yes li { color: rgba(63,125,100,.9); }
  .exc-list-no  li { color: rgba(198,90,52,.85); }

  /* Aviso */
  .exc-warn {
    margin-top: 6px; font-size: .82rem; font-weight: 600;
    color: #9a6b12; line-height: 1.4; padding: 6px 8px;
    background: rgba(224,168,62,.12); border-radius: 6px;
  }
</style>
