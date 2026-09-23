<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { FlightModel } from '$lib/models/FlightModel';
  import { DAY_ENTRY_STYLES } from '$lib/config/ui';

  export let flight: FlightModel;

  const s = DAY_ENTRY_STYLES.flight;

  $: props = {
    href:       `/vuelos?flash=${flight.data.id}`,
    ...s,
    label:      flight.typeLabel,
    title:      `${flight.data.from} → ${flight.data.to}`,
    detail:     `${flight.data.airline}${flight.data.arr ? ` · llega ${flight.data.arr}` : ''}`,
    titleSerif: true,
    time:       flight.data.dep,
  } satisfies DayItemProps;
</script>

<DayItem {...props} />
