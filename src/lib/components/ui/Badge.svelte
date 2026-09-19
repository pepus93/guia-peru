<script lang="ts">
  import type { BadgeType } from '$lib/models/types';

  export let type: BadgeType;

  const MAP: Record<BadgeType, { cls: string; label: string }> = {
    fly:  { cls: 'b-fly',  label: '✈ Vuelo' },
    bed:  { cls: 'b-bed',  label: '🛏 Dormir' },
    act:  { cls: 'b-act',  label: '🎯 Planes' },
    warn: { cls: 'b-warn', label: '⚠ Ojo' },
  };

  $: info = MAP[type] ?? { cls: '', label: '' };
</script>

<span class="badge {info.cls}">{info.label}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: .74rem;
    font-weight: 700;
    letter-spacing: .04em;
    padding: 3px 8px;
    border-radius: 6px;
    white-space: nowrap;
  }
</style>
