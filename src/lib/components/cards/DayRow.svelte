<script lang="ts">
  export let icon: string;
  export let iconBg: string = 'var(--paper-2)';
  export let label: string;
  export let title: string;
  export let detail: string = '';
  export let titleSerif: boolean = false;
</script>

<div class="row">
  <div class="ic" style="background:{iconBg}">{icon}</div>
  <div class="row-body">
    <div class="rt">{label}</div>
    <div class="rv" class:font-serif={titleSerif}>{title}</div>
    {#if detail}<div class="rd">{detail}</div>{/if}
    <slot name="pills" />
    <slot name="actions" />
  </div>
</div>

<style>
  .row {
    display: flex;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }

  .ic {
    flex: 0 0 32px;
    height: 32px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-size: .95rem;
  }

  .row-body { flex: 1; min-width: 0; }

  .rt {
    font-size: .68rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 600;
  }

  .rv {
    font-size: .9rem;
    font-weight: 500;
    margin-top: 4px;
    line-height: 1.3;
  }

  .rd {
    font-size: .78rem;
    color: var(--ink-soft);
    margin-top: 3px;
    line-height: 1.35;
  }
</style>
