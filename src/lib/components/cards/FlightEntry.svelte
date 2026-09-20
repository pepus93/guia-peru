<script lang="ts">
  import type { FlightModel } from '$lib/models/FlightModel';
  import DayItem from './DayItem.svelte';

  export let flight: FlightModel;
</script>

<DayItem
  href="/vuelos?flash={flight.data.id}"
  icon="✈"
  iconBg="rgba(58,110,165,.14)"
  label={flight.typeLabel}
  title="{flight.data.from} {flight.data.dep} → {flight.data.to} {flight.data.arr}"
  detail={flight.data.airline}
  titleSerif={true}
>
  <svelte:fragment slot="pills">
    {#if flight.infoBadges.length}
      <div class="pill-line">
        {#each flight.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
      </div>
    {/if}
  </svelte:fragment>
</DayItem>
