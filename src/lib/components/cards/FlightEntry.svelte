<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { FlightModel } from '$lib/models/FlightModel';

  export let flight: FlightModel;

  $: props = {
    href:       `/vuelos?flash=${flight.data.id}`,
    icon:       'plane',
    iconBg:     'rgba(58,110,165,.14)',
    label:      flight.typeLabel,
    title:      `${flight.data.from} → ${flight.data.to}`,
    detail:     `${flight.data.airline}${flight.data.arr ? ` · llega ${flight.data.arr}` : ''}`,
    titleSerif: true,
    time:       flight.data.dep,
  } satisfies DayItemProps;
</script>

<DayItem {...props} />
