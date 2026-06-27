# CSS-Struktur SAARVIK – v8

Die CSS-Dateien sind modular sortiert. `styles.css` ist nur der Einstiegspunkt und importiert die Module in der richtigen Reihenfolge.

## Reihenfolge

1. `00-settings.css` – Farben, Schatten, Rundungen, globale Variablen
2. `01-base.css` – Reset, Typografie, Container, Buttons, Navigation-Grundlagen
3. `02-theme-refinements.css` – visuelle Feinabstimmung
4. `03-pages-museum-adventure.css` – Museum- und Wikinger-Abenteuer-Seiten
5. `04-home-footer.css` – Startseite, Hero und Footer-nahe Bereiche
6. `05-components.css` – Cards, Panels, Grids und wiederverwendbare Elemente
7. `06-page-overrides.css` – letzte gezielte Korrekturen
8. `saarvik-custom.css` – schnelle eigene Anpassungen, wird nach `styles.css` geladen

## Wichtig

Für kleine Änderungen bitte zuerst `saarvik-custom.css` benutzen. Dadurch bleiben die Hauptdateien stabil und Änderungen greifen zuverlässiger.

## Backup

Die vorherige getestete Struktur liegt als `styles.before-v8-professional-structure.css` vor. Zusätzlich befinden sich die v7-Dateien im Ordner `css/_v7-backup/`.
