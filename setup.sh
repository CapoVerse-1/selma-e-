#!/bin/bash

echo "Selma Anwaltskanzlei - Finanzverwaltung Setup"
echo "================================================"
echo

echo "Installiere Abhängigkeiten..."
npm install

if [ $? -ne 0 ]; then
    echo
    echo "Fehler beim Installieren der Abhängigkeiten!"
    echo
    exit 1
fi

echo
echo "Installation abgeschlossen!"
echo
echo "Starte Entwicklungsserver..."
echo
echo "Der Server wird auf http://localhost:3000 gestartet."
echo "Drücken Sie Strg+C, um den Server zu beenden."
echo

npm run dev 