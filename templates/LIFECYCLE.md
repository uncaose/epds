# LIFECYCLE

Pick the one thing the request is really about. Walk it through its whole life, one row per state or event: first visit (empty) -> each event -> end -> after the end (return visit, next cycle) -> a mistake and the way back. Fill every cell. Delete this paragraph and the Example section when done. Gate: `node <skill dir>/bin/check.mjs LIFECYCLE.md` (exit 1 while any cell is empty, has no exit code, or records a non-zero one). Rows are re-run, not just read: a `check.mjs [<html>] <checks>.json` command is executed again by the gate (a missing json or a failing re-run fails the row); rows it cannot re-run are counted as "N rows not re-run".

| state | what the user sees and can do | works check | common-sense usability & detail check | how executed (command + exit code) |
|---|---|---|---|---|
| first visit, empty | <what is on screen, what can be done> | <observable action -> result> | <what a normal person expects here, in one sentence> | <command -> exit code> |
| <event> | <...> | <...> | <...> | <...> |
| end | <...> | <...> | <...> | <...> |
| after the end | <...> | <...> | <...> | <...> |
| mistake / undo | <...> | <...> | <...> | <...> |

The detail-check cell answers: would an ordinary person using this state find it obvious what to do, see the result of each action, and find every value, label and message correct and tidy? Is there a way back from a dead end or a wrong entry?

## Example (delete this section) - a flashcard quiz

| state | what the user sees and can do | works check | common-sense usability & detail check | how executed (command + exit code) |
|---|---|---|---|---|
| first visit, empty | no cards yet; a "front" box, a "back" box, an Add button | type a front and back, press Add, the card is counted | the empty state says "Add your first card"; Enter in the back box adds; boxes clear after adding | `check.mjs c1.json` -> exit 0 |
| quiz in progress | one card front shown; a Show answer button, then Right / Wrong | Show answer reveals the back; Right moves to the next card | progress reads "2 of 5"; the answer is hidden again on the next card; buttons are large enough on a 390px screen | `check.mjs c2.json` -> exit 0 |
| end of the round | a score "4 of 5 right" and a Restart button | after the last card the score matches the answers given | the score is not "4/5/5"; the wrong cards are offered again with "Review wrong ones" | `check.mjs c3.json` -> exit 0 |
| after the end | reload or return the next day; the cards are still there | reload, cards remain, last score is shown | the app opens on the card list, not on a half-finished round with a stale score | `check.mjs c4.json` -> exit 0 |
| mistake / undo | a Delete on each card; an empty or whitespace card is refused | Delete removes the card; empty input adds nothing | a one-line message says why an empty card was refused; a deleted card can be restored by Undo | `check.mjs c5.json` -> exit 0 |
