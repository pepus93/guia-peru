<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import CardHeader  from './CardHeader.svelte';
  import Card        from './Card.svelte';
  import ContactInfo from '$lib/components/ui/ContactInfo.svelte';
  import Icon        from '$lib/components/ui/Icon.svelte';

  export let activity: Activity;
  export let compact = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;
  $: flashing = $flashId === activity.id;

  let expanded = false;
  $: if ($flashId === activity.id) expanded = true;

  function edit() { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<Card id={activity.id} {flashing} flashColor="var(--clay)" cssClass="act-card" dayDm={activity.dayDm} collapsible={!compact} bind:expanded onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>
  <CardHeader
    icon={typeInfo.icon}
    type="{typeInfo.label}{activity.time ? ` · ${activity.time}` : ''}{activity.duration ? ` (${activity.duration})` : ''} · {model.dateLabel}"
    name={activity.name}
    place={activity.meet ? `📍 ${activity.meet}${activity.end ? ` → 🏁 ${activity.end}` : ''}` : ''}
    placeUrl={model.meetUrl || model.mapsUrl || undefined}
  >
    <svelte:fragment slot="pills">
      {#if model.infoBadges.length}
        <div class="pill-line badges-row">
          {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
        </div>
      {/if}
    </svelte:fragment>
  </CardHeader>

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

    <!-- Incluye -->
    {#if activity.includes?.length}
      <div class="card-section">
        <div class="card-section-title">Incluye</div>
        <ul class="exc-list exc-list-yes">
          {#each activity.includes as item}<li><Icon name="check" size={13} />{item}</li>{/each}
        </ul>
      </div>
    {/if}

    <!-- No incluye -->
    {#if activity.notIncludes?.length}
      <div class="card-section">
        <div class="card-section-title">No incluye</div>
        <ul class="exc-list exc-list-no">
          {#each activity.notIncludes as item}<li><Icon name="x" size={13} />{item}</li>{/each}
        </ul>
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
  .badges-row { margin-top: 5px; }

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
  .exc-list li { font-size: .84rem; line-height: 1.3; display: flex; align-items: center; gap: 5px; }
  .exc-list-yes li { color: rgba(63,125,100,.9); }
  .exc-list-no  li { color: rgba(198,90,52,.85); }

  /* Aviso */
  .exc-warn {
    display: flex; align-items: center; gap: 6px;
    margin-top: 6px; font-size: .82rem; font-weight: 600;
    color: #9a6b12; line-height: 1.4; padding: 6px 8px;
    background: rgba(224,168,62,.12); border-radius: 6px;
  }
</style>
