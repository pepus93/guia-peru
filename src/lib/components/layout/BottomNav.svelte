<script lang="ts">
  import { page } from '$app/stores';
  import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';

  const TABS: { href: string; icon: IconName; label: string; color: string }[] = [
    { href: '/dias',    icon: 'calendar',         label: 'Días',    color: 'var(--terra)' },
    { href: '/vuelos',  icon: 'plane',            label: 'Vuelos',  color: 'var(--sky)'   },
    { href: '/hoteles', icon: 'bed',              label: 'Hoteles', color: 'var(--jade)'  },
    { href: '/planes',  icon: 'compass',          label: 'Planes',  color: 'var(--lila)'  },
    { href: '/cambio',  icon: 'arrow-left-right', label: 'Cambio',  color: 'var(--clay)'  },
  ];
</script>

<nav class="bottom-nav">
  {#each TABS as tab}
    <a href={tab.href} class="nav-item" class:active={$page.url.pathname.startsWith(tab.href)} style="--tab-color: {tab.color}">
      <span class="nav-icon"><Icon name={tab.icon} size={22} /></span>
      <span class="nav-label">{tab.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 520px;
    z-index: 20;
    background: var(--card);
    border-top: 1px solid var(--line);
    box-shadow: 0 -4px 20px -10px rgba(42,26,18,.3);
    display: flex;
    padding: 4px 2px;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4px);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    text-decoration: none;
    color: var(--ink-soft);
    border-radius: 12px;
    padding: 4px 1px;
    transition: color .2s;
    -webkit-user-select: none;
    user-select: none;
    position: relative;
  }

  .nav-item.active {
    color: var(--tab-color);
  }

  .nav-item::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 50%;
    width: 40px;
    height: 28px;
    background: color-mix(in srgb, var(--tab-color) 14%, transparent);
    border-radius: 9px;
    transform: translateX(-50%) scale(0.6);
    opacity: 0;
    transition: opacity .22s, transform .22s;
  }
  .nav-item.active::before {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    opacity: .45;
    transition: opacity .2s, transform .2s;
    position: relative;
  }
  .nav-item.active .nav-icon {
    opacity: 1;
    transform: translateY(-1px);
  }

  .nav-label {
    font-size: .72rem;
    font-weight: 600;
    letter-spacing: .01em;
    position: relative;
  }
  .nav-item.active .nav-label {
    font-weight: 700;
  }
</style>
