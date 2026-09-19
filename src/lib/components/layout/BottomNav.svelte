<script lang="ts">
  import { page } from '$app/stores';

  const TABS = [
    { href: '/dias',    icon: '📅', label: 'Días' },
    { href: '/vuelos',  icon: '✈️',  label: 'Vuelos' },
    { href: '/hoteles', icon: '🏨', label: 'Hoteles' },
    { href: '/planes',  icon: '🎯', label: 'Planes' },
    { href: '/cambio',  icon: '💱', label: 'Cambio' },
    { href: '/info',    icon: '📋', label: 'Info' },
  ];
</script>

<nav class="bottom-nav">
  {#each TABS as tab}
    <a href={tab.href} class="nav-item" class:active={$page.url.pathname.startsWith(tab.href)}>
      <span class="nav-icon">{tab.icon}</span>
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
    color: var(--terra-deep);
  }

  /* Pill indicator behind active icon */
  .nav-item::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 50%;
    width: 40px;
    height: 28px;
    background: rgba(198, 90, 52, 0.12);
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
    font-size: 1.1rem;
    line-height: 1;
    filter: grayscale(.5);
    transition: filter .2s, transform .2s;
    position: relative;
  }
  .nav-item.active .nav-icon {
    filter: none;
    transform: translateY(-1px);
  }

  .nav-label {
    font-size: .52rem;
    font-weight: 600;
    letter-spacing: .01em;
    position: relative;
  }
  .nav-item.active .nav-label {
    font-weight: 700;
  }
</style>
