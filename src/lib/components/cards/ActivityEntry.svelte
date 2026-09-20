<script lang="ts">
  import type { ActivityModel } from '$lib/models/ActivityModel';
  import DayItem from './DayItem.svelte';

  export let act: ActivityModel;
</script>

<DayItem
  href="/planes?flash={act.data.id}"
  icon={act.typeInfo.icon}
  iconBg={act.typeInfo.bg}
  label="{act.typeInfo.label}{act.timeLabel ? ` · ${act.timeLabel}` : ''}"
  title={act.data.name}
  detail={act.data.meet ? `📍 ${act.data.meet}` : ''}
>
  <svelte:fragment slot="pills">
    {#if act.infoBadges.length}
      <div class="pill-line">
        {#each act.infoBadges.slice(0, 2) as b}<span class="pill {b.cls}">{b.label}</span>{/each}
      </div>
    {/if}
  </svelte:fragment>
</DayItem>
