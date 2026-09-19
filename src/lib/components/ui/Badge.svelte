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
  :global(.b-fly)  { background: rgba(58,110,165,.14); color: #2a5a8a; }
  :global(.b-bed)  { background: rgba(63,125,100,.14); color: #2e6a53; }
  :global(.b-act)  { background: rgba(224,168,62,.18); color: #7a5a10; }
  :global(.b-warn) { background: rgba(198,90,52,.14);  color: #8a3a1a; }
</style>
