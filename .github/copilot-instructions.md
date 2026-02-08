# Copilot Instructions for lbol-daily-character

Purpose: onboard an AI agent quickly so it can make safe, minimal changes to this daily character rotation app.

## Project snapshot

Static single-page app (SPA) that displays a different Touhou character daily. App is deterministic—same day always shows same character. All logic in `public/js/`, assets in `public/assets/`.

## Architecture: Character Rotation System

**Daily character selection flow:**

1. `app.js::boot()` → gets today's character via `getTodayCharacter()`
2. `character.js::getTodayCharacter()` → calculates `dayIndex` from KST epoch, derives `bagIndex` and `posInBag`
3. `character.js::generateBag(bagIndex)` → creates shuffled bag (5 characters × 2 variants = 10 items) for that rotation period
4. Render character name/icon/exhibit to DOM

**Determinism via seeded PRNG:**

- Epoch: 2003-10-28 KST (day 0)
- BAG_SIZE = 5 characters × 2 variants = 10 items
- Each bag uses `mulberry32` RNG seeded by `1000 + bagIndex * 37`
- Shuffle logic checks for consecutive duplicates across bag boundaries and swaps them to avoid repetition (see `swapFirstWithRandomIndex`)

## Essential files

- [public/js/character.js](../public/js/character.js) — `CHARACTERS` list (5 chars × 2 exhibits each), `generateBag()`, `getTodayCharacter()`, RNG logic
- [public/js/time.js](../public/js/time.js) — `getDayIndex()` (days since epoch), `getMsToNextDay()` (ms until next KST midnight), `EPOCH_KST_MIDNIGHT_MS`
- [public/js/app.js](../public/js/app.js) — `boot()` function: initial render + recursive timeout schedule
- [public/index.html](../public/index.html) — DOM elements: `todayName`, `todayCharIcon`, `todayExhibit`

## Critical knowledge: KST timezone handling

- KST = UTC+9. All date calculations must add 9 hours to UTC time.
- `getKstDate()` — returns current time + 9hr offset
- `getKstMidnightMs(kstDate)` — returns UTC ms of midnight for that KST day (does NOT add offset when computing)
- Tests in `test/time.test.js` verify KST behavior—use these as reference

## Code conventions & tooling

- **Formatting:** Spaces for indentation, double quotes (Biome config). Run `pnpm check` before committing.
- **Modules:** ES6 imports/exports only (no CommonJS)
- **Dev server:** `pnpm dev` starts live-server on port 8080
- **Testing:** `pnpm test` runs Node test runner; tests are in `test/`
- **No external runtime deps.** Changes verified by browser refresh.

## Data structures

**Character object (from CHARACTERS array):**

```javascript
{ id, name, icon, exhibits: { A, B } }
```

**Bag item (created by generateBag):**

```javascript
{
  (characterId, characterName, icon, variant, exhibit, fullName);
}
// fullName = "${name}${variant}" (e.g., "레이무A")
```

## When to ask before changing

- **Epoch or BAG_SIZE:** Affects all future rotations globally
- **RNG seed formula:** Small changes break determinism across all days
- **Bag generation logic:** Especially the duplicate-checking swap logic
- **DOM element IDs:** Must update both HTML and references in app.js

## Common tasks

- **Add character:** Add entry to `CHARACTERS`, add icon/exhibit assets to `public/assets/` subdirs
- **Change rotation speed:** Adjust `BAG_SIZE` (but ask first—affects all dates)
- **Verify a day's character:** `getDayIndex(new Date('2024-01-11T00:00:00+09:00'))` in console, derive bagIndex/posInBag, check `generateBag(bagIndex)[pos]`
- **Debug scheduling:** Check `getMsToNextDay()` output near midnight in browser console

## Project files at a glance

```
public/
  index.html           ← DOM, minimal
  js/
    app.js            ← entry point, boot & schedule
    character.js      ← character data, bag generation, RNG
    time.js           ← KST time utilities, day index math
  css/styles.css
  assets/characters/  ← icon PNGs
  assets/exhibits/    ← exhibit PNGs
test/
  time.test.js        ← KST behavior tests
biome.json            ← formatter/linter config
```
