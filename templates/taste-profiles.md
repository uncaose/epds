# Taste profiles

Owner taste is chosen and changed by **type**, not reviewed from scratch on every screen. Each type is a named, summarised set of visual parameters. The agent builds and measures against the chosen type (`docs/policies/visual-quality-layers.md` layers 1-3). The owner only confirms the type, switches it, or asks for a detailed change.

## How the owner sees it

Show one line per type, as `type: summary`, with the current choice marked:

```
* clean (default): tidy and uncluttered, generous space, neutral palette with one accent, thin lines, little motion
  warm-friendly: soft corners, warm palette, rounded type, gentle motion
  playful-bold: saturated colors, big type, bouncy motion, illustrations
  editorial-premium: strong type contrast, neutral palette, sharp grid, restrained motion
  high-contrast-access: maximum legibility, large targets, strong contrast, minimal decoration
```

The default type is `clean`: use it whenever the owner has not chosen another type. The list is an example, not a closed set. Add, merge or drop types to fit the product, and keep it short: three to seven types.

## What a type fixes (parameters)

| Parameter | Example values |
|---|---|
| Palette mood | neutral / warm / cool / saturated; accent count |
| Density and spacing | compact / regular / airy; base grid unit |
| Type | family pairing (at most two); scale ratio; weight contrast |
| Shape | corner radius; line weight; elevation |
| Motion | none / subtle / expressive; duration range |
| Imagery | none / icons only / illustration / photography |
| Rubric weights | which visual dimensions count most (for example legibility over rhythm for high-contrast-access) |

A type maps to concrete design tokens, so layer 1 (structure) and layer 2 (measurement) can check against it. Its rubric weights feed layer 3 (independent review).

## Changing taste

- **Switch type:** the owner names another type, and the agent re-derives tokens and thresholds from it and re-runs layers 1-3.
- **Detailed request:** the owner states a change in plain words (for example "warmer accent, less motion"). The agent records it as a delta on the current type (`type + delta: summary`), shows the resulting parameter change for approval, then re-runs layers 1-3.
- When the same delta recurs across screens or products, promote it to a new type, or fold it into an existing one.

## Record

| Date | Type (+ delta) | Summary | Who confirmed | Applies to |
|---|---|---|---|---|
| | | | | |
