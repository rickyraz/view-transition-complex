---
name: react-view-transition
description: "Use this skill when working with, explaining, debugging, or architecting React View Transitions. Covers the full internal pipeline: Fiber commit phase integration, pairing logic, snapshot model, browser API coordination, resource blocking, gesture support, and known limitations (reordering, async streaming, Suspense). Triggers: any mention of ViewTransition component, view-transition-name, startViewTransition, enter/exit/share transitions, gesture transitions, or animating between React states."
license: Internal Reference
---

# React View Transitions — Deep Architecture Skill

## 1. Core File Map

| File | Role |
|------|------|
| `react-reconciler/src/ReactFiberCommitViewTransitions.js` | Core commit-phase orchestration: enter, exit, update, pairing |
| `react-reconciler/src/ReactFiberViewTransitionComponent.js` | ViewTransitionState type, auto-naming, className resolution |
| `react-dom-bindings/src/client/ReactFiberConfigDOM.js` | DOM/browser API integration: `startViewTransition`, font/image blocking, animation optimization |
| `react-reconciler/src/ReactFiberApplyGesture.js` | Gesture-driven transition cloning |
| `react-reconciler/src/ReactFiberCommitWork.js` | Commit phase hooks: beforeMutation, mutation, afterMutation, passive |
| `react-reconciler/src/ReactFiberWorkLoop.js` | Lane eligibility check, `shouldStartViewTransition` flag, wraps commit in `startViewTransition()` |

---

## 2. The Three-Phase Commit Integration

View Transitions are wired **across all four commit sub-phases**:

```
[Before Mutation]
  → commitBeforeMutationEffects()
      → Track entering Fibers (shouldStartViewTransition = true)
      → commitExitViewTransitions() — applies view-transition-name to OLD DOM
      → Looks for enter/exit pairs via appearingViewTransitions Map

[Mutation]
  → DOM mutations happen (inside browser's startViewTransition.update())
  → commitBeforeUpdateViewTransition() called TWICE:
      1st call: applies names to current (old) tree
      2nd call: applies names to finishedWork (new) tree

[After Mutation]
  → commitAfterMutationEffects()
      → commitEnterViewTransitions() — applies view-transition-name to NEW DOM
      → measureViewTransitionHostInstances() — check if layout actually changed
      → restoreUpdateViewTransition() — cancels transitions where nothing moved

[Passive]
  → restoreNestedViewTransitions() — cleans up nested ViewTransitions
     whose parent mutated but they themselves didn't
```

**Key insight:** The `startViewTransition()` browser call wraps the mutation phase. Everything before it is "old state setup", everything after is "new state setup".

---

## 3. ViewTransitionState — The Hidden State Object

```typescript
type ViewTransitionState = {
  autoName: null | string,       // lazily assigned unique name (base-32 encoded)
  paired: null | ViewTransitionState, // temp during commit — linked to matching enter/exit partner
  clones: null | Array<Instance>, // temp during gesture phase — DOM clones
  ref: null | ViewTransitionInstance, // current ref instance
};
```

- `paired` is **a temporary cross-reference** set during the commit phase and cleared after.
- `autoName` is generated lazily at commit time (not render time), using `_${prefix}t_${globalClientId.toString(32)}_` format.
- If `props.name` is set and not `'auto'`, the explicit name is used instead of `autoName`.

---

## 4. The Pairing System

**The `appearingViewTransitions` Map** (`Map<string, ViewTransitionState>`) is populated during `accumulateSuspenseyCommit` (before mutation), tracking **entering** ViewTransitions by name.

During exit processing (`commitExitViewTransitions`):
```
name → lookup in appearingViewTransitions
  Found?  → SHARE transition: both sides marked paired, onShare fires
  Not found? → EXIT transition: onExit fires, element cross-fades out
```

**Pairing resolution order matters:**
- Pairs are **deleted from the Map** as they are resolved (size drops to zero = all matched)
- If the exiting element is outside the viewport → names are **reverted**, no animation
- If the entering element is outside the viewport after pairing → `onShare` still fires (a known edge case)

**What triggers which callback:**
| Scenario | Callback |
|----------|----------|
| Element appears, no pair found | `onEnter` |
| Element disappears, no pair found | `onExit` |
| Both sides found by name | `onShare` |
| Gesture enter | `onGestureEnter` |

---

## 5. The `className` / `'none'` Early-Exit Pattern

Every transition function checks `getViewTransitionClassName()` first:

```js
const className = getViewTransitionClassName(props.default, props.enter /* or exit/update/share */);
if (className === 'none') return; // bail out — no animation
```

`className === 'none'` means the developer opted out of that transition type. React uses this to avoid assigning `view-transition-name` entirely, which prevents the browser from animating that boundary.

**The update bug (documented in source):**
> "if update='foo' layout='none' and it turns out this was a layout-only change, then the 'foo' class will be applied even though it was not actually an update. Which is a bug."

The `Update` flag on the Fiber is used as a proxy for "did content actually change" but layout-only changes can set it too.

---

## 6. Resource Blocking — Font & Image Gating

Inside `startViewTransition.update()`, React executes this blocking logic **after** `mutationCallback()`:

```
1. Was fonts.status === 'loaded' before mutation?
   → forceLayout() to trigger any new font loads
   → If now 'loading' → push document.fonts.ready to blockingPromises

2. For each suspenseyImage (viewport only):
   → Estimate bytes
   → If cumulative bytes > estimatedBytesWithinLimit → abandon image blocking
   → Else push load promise

3. Race blockingPromises vs setTimeout(500ms)
   → Winner calls layoutCallback()
```

**Why only fonts that START loading AFTER mutation?**
React intentionally ignores fonts that were already loading before the commit. This avoids blocking on unrelated earlier font loads (other transitions, sync optimistic state, preloads).

**The byte budget:**
React estimates image sizes and abandons blocking if the total would exceed a threshold — it assumes it won't finish in time and falls back to font-only blocking.

---

## 7. Animation Optimization — Width/Height Keyframe Removal

After the browser generates keyframes, React runs an optimization pass:

```js
// For each animation on a ::view-transition pseudo-element:
// Check if width and height are IDENTICAL across all keyframes
// If yes → remove them → browser uses CSS-computed width/height
// Then verify: does computed style match what we deleted?
//   No → add them back (pseudo-element has different intrinsic size)
//   Yes → leave them out (avoids animating a dimension that didn't change)
```

This reduces GPU compositing work when elements only move position but don't resize.

---

## 8. Gesture Support — Clone Architecture

`ReactFiberApplyGesture.js` handles gesture-driven transitions differently:

```
detectMutationOrInsertClones(finishedWork)
  → If mutations found:
      cloneRootViewTransitionContainer(root.containerInfo)
      recursivelyInsertClones(finishedWork, rootClone, ...)
      root.gestureClone = rootClone
  → If no mutations:
      cancelRootViewTransitionName(root.containerInfo)
      root.gestureClone = null
```

Gestures clone the **entire root** container when needed, not individual elements. Cloned instances are stored in `ViewTransitionState.clones[]`.

---

## 9. Lane Eligibility Gate

Not every React update gets a View Transition. The check is:

```js
const isViewTransitionEligible =
  enableViewTransition &&
  includesOnlyViewTransitionEligibleLanes(committedLanes);
```

Only specific lanes (not sync urgent lanes, not retry lanes) are eligible. This prevents transitions from firing on urgent updates (like keyboard input) where animation would hurt perceived performance.

---

## 10. Reordering Limitation — The Snapshot Layer Problem

```
❌ WRONG assumption: ViewTransition tracks individual elements inside its boundary

✅ CORRECT: ViewTransition treats its entire subtree as ONE opaque layer
```

When multiple `HostInstance` children exist inside one `<ViewTransition>`:
- Names are assigned **in DOM order** at snapshot time
- If DOM order changes between snapshots → same-named slots hold different elements
- Result: **cross-fade**, not position swap

**Fix:** Each list item needs its own `<ViewTransition name="item-{id}">`.

---

## 11. Async Update Constraint — The Atomic Mutation Wall

`document.startViewTransition()` contract:
```
capture old state → run update() callback → capture new state → animate
```

This is a single atomic operation. React cannot:
- Feed intermediate streaming chunks as "new states"
- Animate between partially hydrated states
- Chain multiple Suspense reveals in one transition

React's workarounds:
- `accumulateSuspenseyCommit` + `suspendOnActiveViewTransition` — holds the commit until the previous transition finishes
- SSR fizz instruction set has its own `startViewTransition` wrapper for Suspense batch reveals

---

## 12. Why Userland Cannot Replicate This

The browser API operates **below the DOM**, at the compositing layer:

| Capability | Userland JS | Native API |
|-----------|------------|------------|
| Capture composited visual output | ❌ | ✅ |
| Snapshot Canvas/WebGL frames | ❌ | ✅ |
| Suspend rendering pipeline mid-frame | ❌ | ✅ |
| Insert `::view-transition-*` pseudo-elements | ❌ | ✅ |
| Coordinate with font/image decode pipeline | Approximate | ✅ Native |
| Animate cross-origin iframe content | ❌ | ✅ (within policy) |

GSAP/Framer Motion use FLIP (First Last Invert Play) which only works on DOM transforms — not rasterized snapshots.

---

## 13. Key Constants & Magic Values

| Constant | Value | Meaning |
|----------|-------|---------|
| `SUSPENSEY_FONT_AND_IMAGE_TIMEOUT` | 500ms | Max wait for fonts/images before proceeding |
| `estimatedBytesWithinLimit` | threshold | Image byte budget before abandoning image blocking |
| `globalClientIdCounter` | increments in base-32 | Auto-name uniqueness seed |
| `__reactViewTransition` | property on document | Current running transition handle |

---

## 14. Architectural Decision Summary

| Decision | Reason |
|----------|--------|
| Commit phase (not render phase) | DOM must exist to measure and name elements |
| `appearingViewTransitions` Map pre-populated before mutation | Exit pass needs to look up pairs without traversing new tree |
| `shouldStartViewTransition` flag | Avoids wrapping non-animated commits in startViewTransition() |
| `restoreViewTransitionOnHostInstances()` on out-of-viewport | Prevents off-screen elements flying in from edges |
| Double-call of `commitBeforeUpdateViewTransition` | Old tree needs names for snapshot; new tree needs names for new state |
