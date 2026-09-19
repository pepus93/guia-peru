<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import CardHeader from './CardHeader.svelte';
  import CardMenu from './CardMenu.svelte';

  export let activity: Activity;
  export let compact = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;
  $: flashing = $flashId === activity.id;

  function edit() { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<div id={activity.id} class="card act-card" class:flash={flashing}>
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
    {#if activity.bookingUrl}
      <a class="btn-nav" href={activity.bookingUrl} target="_blank" rel="noreferrer">🎫 Ver reserva</a>
    {/if}
  </div>
</div>

<style>
  .act-card { --flash-color: var(--clay); }
  .badges-row { margin-top: 5px; }
</style>
