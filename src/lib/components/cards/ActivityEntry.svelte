<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { ActivityModel } from '$lib/models/ActivityModel';

  export let act: ActivityModel;

  $: props = {
    href:   `/planes?flash=${act.data.id}`,
    icon:   act.typeInfo.icon,
    iconBg: act.typeInfo.bg,
    label:  act.typeInfo.label,
    title:  act.data.name,
    detail: act.data.meet ? `📍 ${act.data.meet}` : '',
    time:   act.data.time || undefined,
  } satisfies DayItemProps;
</script>

<DayItem {...props} />
