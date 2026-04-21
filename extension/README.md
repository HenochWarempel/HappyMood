# H-Structuur Checker — Chrome Extensie

Een strakke Chrome-extensie voor websitebouwers die snel willen controleren of de heading-hiërarchie (H1–H6) van een pagina correct is opgebouwd.

## Installeren in Chrome

1. Open Chrome en ga naar `chrome://extensions/`
2. Zet **Ontwikkelaarsmodus** aan (rechtsbovenin)
3. Klik op **Uitgepakte extensie laden**
4. Selecteer de map `extension/`
5. Klaar — het H-icoontje verschijnt in je werkbalk

## Gebruik

- Klik op het **H-icoontje** in de werkbalk → popup met aan/uit-knop
- Of gebruik de sneltoets **Alt + H** om de checker direct te activeren/deactiveren

## Wat wordt getoond

### Bovenaan de pagina (sticky paneel)
| Onderdeel | Beschrijving |
|---|---|
| **Statistieken** | Aantal H1 t/m H6 tags op de pagina |
| **Problemen** | Lijst van fouten en waarschuwingen, klikbaar |
| **Heading-structuur** | Visuele boomstructuur van alle headings, klikbaar |

### Naast elke heading op de pagina
- Gekleurde tag-badge (bijv. `H1`, `H2`) die aangeeft welk niveau de heading heeft
- Oranje badge met uitroepteken bij een heading met een probleem

## Gedetecteerde problemen

| Type | Beschrijving |
|---|---|
| **Fout** | Geen H1 aanwezig op de pagina |
| **Fout** | Pagina begint niet met H1 (bijv. eerste heading is H2) |
| **Fout** | Niveaus worden overgeslagen (bijv. H1 → H3, H2 ontbreekt) |
| **Fout** | Lege heading (geen tekst) |
| **Waarschuwing** | Meerdere H1-tags (SEO-probleem) |

## Kleurcodering

| Tag | Kleur |
|---|---|
| H1 | Indigo `#6366f1` |
| H2 | Blauw `#0ea5e9` |
| H3 | Groen `#10b981` |
| H4 | Amber `#f59e0b` |
| H5 | Oranje `#f97316` |
| H6 | Rood `#ef4444` |

## Extra functies

- **Kopieer structuur** — exporteert de volledige heading-boom als platte tekst naar klembord
- **Klikbare headings** — klik in het paneel op een heading om er naartoe te scrollen (met flash-animatie)
- **Minimaliseren** — verberg het paneel zonder de checker uit te zetten
- **Sneltoets** — Alt+H wisselt de checker snel aan/uit zonder popup te openen
