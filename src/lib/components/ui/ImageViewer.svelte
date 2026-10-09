<script lang="ts">
  import { imageViewer, closeImageViewer } from '$lib/stores/ui';
  import Icon from './Icon.svelte';

  let scale = 1;
  let tx = 0, ty = 0;

  let _pinching = false, _dragging = false;
  let _initDist = 0, _initScale = 1;
  let _initTx = 0, _initTy = 0, _initMidX = 0, _initMidY = 0;
  let _dragOx = 0, _dragOy = 0;

  // Reset state whenever the viewer opens
  $: if ($imageViewer) { scale = 1; tx = 0; ty = 0; }

  function _dist(t: TouchList) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }

  function onTouchStart(e: TouchEvent) {
    e.stopPropagation();
    if (e.touches.length === 2) {
      _pinching = true; _dragging = false;
      _initDist = _dist(e.touches); _initScale = scale;
      _initMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      _initMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      _initTx = tx; _initTy = ty;
    } else if (e.touches.length === 1) {
      _dragging = true; _pinching = false;
      _dragOx = e.touches[0].clientX - tx;
      _dragOy = e.touches[0].clientY - ty;
    }
  }

  function onTouchMove(e: TouchEvent) {
    e.stopPropagation();
    if (_pinching && e.touches.length === 2) {
      const d = _dist(e.touches);
      scale = Math.max(1, Math.min(5, _initScale * (d / _initDist)));
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      tx = _initTx + (mx - _initMidX);
      ty = _initTy + (my - _initMidY);
    } else if (_dragging && !_pinching && e.touches.length === 1) {
      tx = e.touches[0].clientX - _dragOx;
      ty = e.touches[0].clientY - _dragOy;
    }
  }

  function onTouchEnd(e: TouchEvent) {
    e.stopPropagation();
    if (e.touches.length === 0) {
      _pinching = false; _dragging = false;
      if (scale < 1.1) { scale = 1; tx = 0; ty = 0; }
    } else if (e.touches.length === 1 && _pinching) {
      _pinching = false; _dragging = true;
      _dragOx = e.touches[0].clientX - tx;
      _dragOy = e.touches[0].clientY - ty;
    }
  }

  function onBackdropClick() {
    if (scale < 1.1) closeImageViewer();
  }
</script>

{#if $imageViewer}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="iv-backdrop"
    on:click={onBackdropClick}
    on:touchstart={onTouchStart}
    on:touchmove={onTouchMove}
    on:touchend={onTouchEnd}
  >
    <img
      src={$imageViewer}
      alt="Imagen"
      class="iv-img"
      style="transform: translate({tx}px, {ty}px) scale({scale})"
    />
    <button class="iv-close" on:click|stopPropagation={closeImageViewer}>
      <Icon name="x" size={16} />
    </button>
  </div>
{/if}

<style>
  .iv-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, .92);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    touch-action: none;
  }

  .iv-img {
    width: 100%;
    max-height: 100dvh;
    object-fit: contain;
    display: block;
    touch-action: none;
    transform-origin: center center;
    will-change: transform;
    user-select: none;
    -webkit-user-select: none;
  }

  .iv-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, .15);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
