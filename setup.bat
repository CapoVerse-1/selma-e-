@echo off
echo Selma Anwaltskanzlei - Finanzverwaltung Setup
echo ================================================

echo.
echo Installiere Abhängigkeiten...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo Fehler beim Installieren der Abhängigkeiten!
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Installation abgeschlossen!
echo.
echo Starte Entwicklungsserver...
echo.
echo Der Server wird auf http://localhost:3000 gestartet.
echo Drücken Sie Strg+C, um den Server zu beenden.
echo.
call npm run dev

pause 