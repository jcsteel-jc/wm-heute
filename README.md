# WM Heute

Eine kleine, werbefreie Web-App für das iPhone.

## Installation auf GitHub Pages

1. Neues GitHub Repository anlegen, z. B. `wm-heute`.
2. Diese Dateien hochladen.
3. In GitHub: Settings → Pages.
4. Source: `Deploy from a branch`.
5. Branch: `main`, Folder: `/root`.
6. Speichern.
7. Die angezeigte Pages-URL auf dem iPhone in Safari öffnen.
8. Teilen → Zum Home-Bildschirm → Name: `WM Heute`.

Deine spätere URL ist ungefähr:

https://jcsteel-jc.github.io/wm-heute/

## Spielplan ändern

Die Spiele stehen in `matches.js`.
Ein Spiel sieht so aus:

```js
{ kickoff: '2026-06-25T22:00:00+02:00', home: 'Ecuador', away: 'Deutschland', group: 'Gruppe E', stage: 'Gruppenphase', city: '' }
```
