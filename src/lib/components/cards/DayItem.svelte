<script lang="ts">
  export let href: string;
  export let icon: string;
  export let iconBg: string = 'var(--paper-2)';
  export let label: string;
  export let title: string;
  export let detail: string = '';
  export let titleSerif: boolean = false;
</script>

<a {href} class="subcard">
  <div class="sc-ic" style="background:{iconBg}">{icon}</div>
  <div class="sc-body">
    <div class="sc-label">{label}</div>
    <div class="sc-title" class:font-serif={titleSerif}>{title}</div>
    {#if detail}<div class="sc-detail">{detail}</div>{/if}
    <slot name="pills" />
  </div>
  <svg class="sc-chev" viewBox="0 0 8 14" width="8" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="1 1 7 7 1 13"/>
  </svg>
</a>

<style>
  .subcard {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    background: var(--paper-2);
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    text-decoration: none;
    color: inherit;
    margin: 6px 0;
    transition: background .15s, box-shadow .15s;
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: hover) {
    .subcard:hover {
      background: var(--paper);
      box-shadow: var(--shadow-sm);
    }
  }

  .subcard:active {
    transform: scale(0.98);
    transition: transform .08s ease;
  }

  .sc-ic {
    flex: 0 0 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-size: .92rem;
  }

  .sc-body {
    flex: 1;
    min-width: 0;
  }

  .sc-label {
    font-size: .6rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 700;
  }

  .sc-title {
    font-size: .86rem;
    font-weight: 600;
    margin-top: 1px;
    line-height: 1.25;
    color: var(--ink);
  }

  .sc-detail {
    font-size: .74rem;
    color: var(--ink-soft);
    margin-top: 2px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sc-chev {
    flex-shrink: 0;
    color: var(--ink-soft);
    opacity: .35;
  }
</style>
