# Selma Anwaltskanzlei - Finanzverwaltung

Eine moderne Web-Anwendung zur Verwaltung von Einnahmen und Ausgaben für eine Anwaltskanzlei.

## Funktionen

- **Dashboard** mit Finanzübersicht
- **Einnahmen-Verwaltung** mit Kategorisierung
- **Ausgaben-Verwaltung** mit Kategorisierung und Kennzeichnung steuerlich absetzbarer Posten
- **Finanzberichte** mit monatlichen Übersichten und Kategorieauswertungen
- **Excel-Export** für alle Finanzberichte

## Technologien

- React.js
- Next.js
- TypeScript
- TailwindCSS
- date-fns
- xlsx (für Excel-Export)

## Installation

1. Stellen Sie sicher, dass Node.js (Version 14 oder höher) und npm installiert sind.

2. Klonen Sie das Repository:

```bash
git clone https://github.com/selma-anwaltskanzlei/finanzverwaltung.git
cd selma-law-finance
```

3. Installieren Sie die Abhängigkeiten:

```bash
npm install
```

4. Starten Sie die Entwicklungsumgebung:

```bash
npm run dev
```

5. Öffnen Sie http://localhost:3000 in Ihrem Browser.

## Verwendung

### Dashboard

Das Dashboard bietet einen Überblick über die aktuelle finanzielle Situation mit:
- Jahresübersicht von Einnahmen, Ausgaben und Bilanz
- Monatliche Zusammenfassung der Finanzen

### Einnahmen verwalten

- Neue Einnahmen hinzufügen mit Kategorisierung
- Bestehende Einnahmen bearbeiten oder löschen
- Einnahmen-Liste als Excel exportieren

### Ausgaben verwalten

- Neue Ausgaben hinzufügen mit Kategorisierung
- Steuerlich absetzbare Ausgaben kennzeichnen
- Bestehende Ausgaben bearbeiten oder löschen
- Ausgaben-Liste als Excel exportieren

### Finanzberichte

- Finanzberichte nach Zeitraum filtern (aktueller Monat, aktuelles Jahr, gesamter Zeitraum)
- Einnahmen und Ausgaben nach Kategorien aufschlüsseln
- Monatliche Finanzübersicht
- Berichte als Excel exportieren

## Datenmodell

In der aktuellen Version werden die Daten temporär im Browser-Speicher gehalten (Mock-Daten). Für eine Produktionsversion empfehlen wir die Anbindung an eine Datenbank.

## Roadmap

- Benutzerauthentifizierung und -verwaltung
- Mandanten-Verknüpfung für Einnahmen
- Dokument-Upload für Belege
- Steuer-Reporting
- Mehrwertsteuer-Verwaltung
- Datenbank-Anbindung
- Mobile App

## Lizenz

© 2023 Selma Anwaltskanzlei 