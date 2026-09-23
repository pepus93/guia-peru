<script lang="ts">
  import type { TripDay } from '$lib/models/types';
  import { CITY_COLORS } from '$lib/models/types';
  import { TripDayModel, BADGE_MAP, badgesFromDayItems } from '$lib/models/TripDayModel';
  import { FlightModel }        from '$lib/models/FlightModel';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { ActivityModel }      from '$lib/models/ActivityModel';
  import DayRow          from '$lib/components/cards/DayRow.svelte';
  import FlightEntry     from '$lib/components/cards/FlightEntry.svelte';
  import HotelEntry      from '$lib/components/cards/HotelEntry.svelte';
  import ActivityEntry   from '$lib/components/cards/ActivityEntry.svelte';
  import ExcursionEntry  from '$lib/components/cards/ExcursionEntry.svelte';
  import { dmToDate, todayDm } from '$lib/utils/dates';
  import { activitiesByDay, flightsMap, staysMap, activitiesMap, saveDayWarn } from '$lib/stores/trip';
  import { openModal, flashId } from '$lib/stores/ui';
  import Icon, { asIcon } from '$lib/components/ui/Icon.svelte';
  import { slide } from 'svelte/transition';
  import { TRIP_ID } from '$lib/config';
  import { onMount } from 'svelte';

  export let day: TripDay;

  $: cityColor = CITY_COLORS[day.city] ?? 'var(--ink-soft)';

  $: model      = new TripDayModel(day);
  $: flights = (day.flightIds ?? [])
      .map(id => $flightsMap[id])
      .filter(Boolean)
      .map(f => new FlightModel(f));
  $: hotelData  = day.stayId      ? $staysMap[day.stayId]            : undefined;
  $: hotel      = hotelData       ? new AccommodationModel(hotelData) : null;
  $: excursion  = day.excursionId ? $activitiesMap[day.excursionId]   : undefined;
  $: acts       = ($activitiesByDay[day.d] ?? [])
    .filter(a => a.id !== day.excursionId)
    .map(a => new ActivityModel(a));

  $: excDayIdx  = excursion?.endDayDm != null
    ? Math.round((dmToDate(day.d).getTime() - dmToDate(excursion.dayDm).getTime()) / 86_400_000)
    : -1;
  $: excDayInfo = excursion?.days?.[excDayIdx] ?? null;

  function timeToMinutes(t: string | undefined): number {
    if (!t) return 840;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  type DayItem =
    | { kind: 'flight';   flight: FlightModel }
    | { kind: 'hotel' }
    | { kind: 'excursion' }
    | { kind: 'activity'; act: ActivityModel };

  $: badgeInfos = badgesFromDayItems(dayItems, !!day.warn);

  $: dayItems = ([
    ...flights.map(f  => ({ kind: 'flight'    as const, sortKey: timeToMinutes(f.data.dep), flight: f })),
    ...(excursion ? [{ kind: 'excursion' as const, sortKey: timeToMinutes(excursion.time) }] : []),
    ...acts.map(a  => ({ kind: 'activity' as const, sortKey: timeToMinutes(a.data.time), act: a })),
    ...(hotel     ? [{ kind: 'hotel'     as const, sortKey: 9999 }] : []),
  ]).sort((a, b) => a.sortKey - b.sortKey);

  let expanded    = false;
  onMount(() => { if (day.d === todayDm()) expanded = true; });
  $: if ($flashId === day.id) expanded = true;
  let editingWarn = false;
  let warnDraft   = '';

  const toggle = () => (expanded = !expanded);

  function startWarnEdit() {
    warnDraft   = day.warn ?? '';
    editingWarn = true;
  }

  async function saveWarn() {
    await saveDayWarn(day.id, warnDraft.trim());
    editingWarn = false;
  }

  function cancelWarnEdit() { editingWarn = false; }

  function addActivity() {
    openModal('activity', {
      id: '', tripId: TRIP_ID, dayDm: day.d, city: day.city,
      type: 'tour', name: '',
    });
  }
</script>

<!-- Card -->
<article class="day card" class:is-today={model.isToday()} class:is-past={model.isPast} class:expanded class:flash={$flashId === day.id} id={day.id} style="--flash-color: {cityColor}; --city-color: {cityColor}">

  <!-- HEAD -->
  <button class="day-head" on:click={toggle} aria-expanded={expanded}>

    <div class="date-block" style="background: color-mix(in srgb, {cityColor} 12%, transparent)">
      <span class="tl-dot" aria-hidden="true"></span>
      <div class="dow">{model.dow}</div>
      <div class="dnum font-serif">{model.dayNum}</div>
      <div class="mon">{model.monthLabel}</div>
    </div>

    <div class="day-main">
      <div class="day-title font-serif">{day.title}</div>
      <div class="day-sub">{day.sub}</div>
      {#if badgeInfos.length}
        <div class="badges">
          {#each badgeInfos as b}
            <span class="badge {b.cls}">
              <Icon name={asIcon(b.icon)} size={11} strokeWidth={2.5} />
              {b.text}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </button>

  <!-- DETAIL -->
  {#if expanded}
    <div class="detail" role="region" transition:slide={{ duration: 220 }}>
      <div class="detail-inner">

        {#each dayItems as item}
          {#if item.kind === 'flight'}
            <FlightEntry flight={item.flight} />
          {:else if item.kind === 'excursion' && excursion}
            <ExcursionEntry {excursion} {excDayIdx} />
          {:else if item.kind === 'activity'}
            <ActivityEntry act={item.act} />
          {:else if item.kind === 'hotel' && hotel}
            <HotelEntry {hotel} dayDm={day.d} />
          {/if}
        {/each}

        <!-- Aviso del día -->
        {#if editingWarn}
          <div class="warn-edit-block">
            <div class="warn-label"><Icon name="alert-triangle" size={13} /> ¡Ojo!</div>
            <textarea
              class="warn-textarea"
              bind:value={warnDraft}
              rows="3"
              placeholder="Escribe una nota de aviso para este día…"
            ></textarea>
            <div class="warn-form-actions">
              <button class="btn-nav" on:click={cancelWarnEdit}>Cancelar</button>
              <button class="btn-nav warn-save-btn" on:click={saveWarn}>Guardar</button>
            </div>
          </div>
        {:else if day.warn}
          <DayRow icon="alert-triangle" iconBg="color-mix(in srgb, var(--gold) 18%, transparent)" label="¡Ojo!" title={day.warn}>
            <svelte:fragment slot="actions">
              <div class="row-actions">
                <button class="btn-nav" on:click={startWarnEdit}><Icon name="pencil" size={13} /> Editar aviso</button>
              </div>
            </svelte:fragment>
          </DayRow>
        {:else}
          <button class="add-warn-btn" on:click={startWarnEdit}><Icon name="alert-triangle" size={13} /> Añadir nota de aviso</button>
        {/if}

        <button class="add-plan-btn" on:click={addActivity}><Icon name="plus" size={13} /> Añadir plan</button>
      </div>
    </div>
  {/if}
</article>

<style>
  /* ── Card shell ─────────────────────────────────────── */
  .day { margin-bottom: 20px; --card-accent: var(--city-color); }
  .day.expanded {
    border-color: color-mix(in srgb, var(--city-color) 50%, transparent);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--city-color) 15%, transparent), var(--shadow);
  }
  .day.is-past { opacity: .45; filter: grayscale(.4); }
  /* ── Head ───────────────────────────────────────────── */
  .day-head {
    display: flex;
    align-items: stretch;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    padding: 0;
    text-align: left;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    overflow: hidden;
  }

  /* ── Date block ─────────────────────────────────────── */
  .date-block {
    flex: 0 0 58px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 4px;
    gap: 1px;
    border-right: 1px solid var(--line);
    position: relative;
    border-bottom-left-radius: var(--radius-sm);
  }
  .day.expanded .date-block {
    border-bottom-left-radius: 0;
  }

  /* Timeline dot — en la parte alta del date-block, donde el hilo "entra" en la card */
  .tl-dot {
    position: absolute;
    left: 50%;
    top: 7px;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--city-color) 12%, var(--card));
    border: 2px solid color-mix(in srgb, var(--city-color) 40%, transparent);
    z-index: 2;
    pointer-events: none;
  }
  .is-today .tl-dot {
    border-color: var(--city-color);
    background: var(--city-color);
    animation: tl-pulse 2.5s ease-out infinite;
  }
  @keyframes tl-pulse {
    0%   { box-shadow: 0 0 0 0   color-mix(in srgb, var(--city-color) 45%, transparent); }
    70%  { box-shadow: 0 0 0 7px color-mix(in srgb, var(--city-color) 0%, transparent);  }
    100% { box-shadow: 0 0 0 0   color-mix(in srgb, var(--city-color) 0%, transparent);  }
  }
  .dow  { font-size: .72rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); font-weight: 700; }
  .dnum { font-size: 1.6rem; font-weight: 700; line-height: 1; color: var(--ink); }
  .mon  { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-soft); font-weight: 700; }

  .day-main { flex: 1; padding: 12px 8px 12px 12px; min-width: 0; }
  .day-title { font-size: 1.08rem; font-weight: 600; line-height: 1.15; letter-spacing: -.01em; }
  .day-sub   { font-size: .84rem; color: var(--ink-soft); margin-top: 2px; line-height: 1.3; }

  .badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
  .badge  { font-size: .74rem; font-weight: 600; padding: 2px 7px; border-radius: 6px; display: inline-flex; align-items: center; gap: 3px; }

  /* ── Detail ─────────────────────────────────────────── */
  .detail-inner {
    padding: 2px 12px 14px;
    border-top: 1px dashed var(--line);
  }

  /* ── Warn editing ───────────────────────────────────── */
  .warn-edit-block {
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }
  .warn-label {
    font-size: .76rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .warn-textarea {
    width: 100%;
    font-family: inherit;
    font-size: .84rem;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 8px 10px;
    outline: none;
    resize: vertical;
    line-height: 1.4;
    transition: .15s;
  }
  .warn-textarea:focus { border-color: var(--gold); }
  .warn-form-actions { display: flex; gap: 6px; margin-top: 6px; justify-content: flex-end; }
  .warn-save-btn { background: color-mix(in srgb, var(--gold) 20%, transparent) !important; color: var(--gold-dark) !important; border-color: color-mix(in srgb, var(--gold) 30%, transparent) !important; }

  /* ── Add warn button ────────────────────────────────── */
  .add-warn-btn {
    display: flex; align-items: center; gap: 6px;
    margin-top: 6px; margin-bottom: 2px;
    padding: 5px 10px;
    border: 1px dashed color-mix(in srgb, var(--gold) 40%, transparent);
    background: color-mix(in srgb, var(--gold) 6%, transparent);
    border-radius: var(--radius-sm);
    color: var(--gold-dark);
    font-family: inherit;
    font-size: .73rem; font-weight: 600;
    cursor: pointer; transition: .15s; width: 100%;
  }
  .add-warn-btn:hover { background: color-mix(in srgb, var(--gold) 12%, transparent); }

  /* ── Add plan button ────────────────────────────────── */
  .add-plan-btn {
    margin-top: 12px;
    width: 100%;
    padding: 8px;
    border: 1px dashed var(--line);
    background: transparent;
    border-radius: var(--radius-sm);
    color: var(--ink-soft);
    font-family: inherit;
    font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: .15s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }
  .add-plan-btn:hover { background: var(--paper-2); }
</style>
