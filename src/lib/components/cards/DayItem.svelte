<script context="module" lang="ts">
  export interface DayItemProps {
    href: string;
    icon: string;
    iconBg?: string;
    label: string;
    title: string;
    detail?: string;
    titleSerif?: boolean;
    time?: string;
  }
</script>

<script lang="ts">
  import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
  const asIcon = (s: string): IconName => s as unknown as IconName;
  export let href: string;
  export let icon: string;
  export let iconBg: string = 'var(--paper-2)';
  export let label: string;
  export let title: string;
  export let detail: string = '';
  export let titleSerif: boolean = false;
  export let time: string = '';
</script>

<a {href} class="subcard">
  <div class="sc-left">
    <div class="sc-ic" style="background:{iconBg}"><Icon name={asIcon(icon)} size={16} /></div>
    {#if time}<div class="sc-time font-serif">{time}</div>{/if}
  </div>
  <div class="sc-body">
    <div class="sc-label">{label}</div>
    <div class="sc-title" class:font-serif={titleSerif}>{title}</div>
    {#if detail}<div class="sc-detail">{detail}</div>{/if}
  </div>
  <span class="sc-chev"><Icon name="chevron-right" size={10} strokeWidth={2.5} /></span>
</a>

<style>
  .subcard {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    background: var(--paper);
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
      background: var(--paper-2);
      box-shadow: var(--shadow-sm);
    }
  }

  .subcard:active {
    transform: scale(0.98);
    transition: transform .08s ease;
  }

  .sc-left {
    flex: 0 0 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .sc-ic {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .sc-time {
    font-size: .7rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -.01em;
    text-align: center;
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
    display: flex;
    color: var(--ink-soft);
    opacity: .35;
  }
</style>
