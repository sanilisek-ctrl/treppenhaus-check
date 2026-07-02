# Echte Speicherung einrichten (Cloudflare KV) – einmalig nötig

Damit "Absenden" wirklich Daten speichert, wenn die App über euren Cloudflare-Link läuft, braucht es zwei Dinge:
1. Einen Cloud-Speicher bei Cloudflare (**KV Namespace**) – dauert 1 Minute
2. Die neue Version der App hochladen, die diesen Speicher benutzt (im ZIP enthalten)

## Schritt 1: KV-Speicher anlegen

1. In Cloudflare: linkes Menü → **Speicher und Datenbanken** → **KV**
2. **Create namespace** / "Namespace erstellen"
3. Name vergeben, z. B. `treppenhaus-daten` → erstellen

## Schritt 2: KV mit deinem Pages-Projekt verbinden

1. Zu deinem Projekt `bath` gehen → **Einstellungen** (Settings)
2. Dort zu **Functions** scrollen → Abschnitt **"KV namespace bindings"**
3. **Add binding**:
   - Variable name: **genau** `TREPPENHAUS_KV` eintragen (Groß-/Kleinschreibung beachten!)
   - KV namespace: den gerade erstellten `treppenhaus-daten` auswählen
4. Speichern

## Schritt 3: Neue Version hochladen

Diesmal müssen **mehrere Dateien in der richtigen Ordnerstruktur** hochgeladen werden (nicht nur eine einzelne `index.html`), weil die App jetzt eine kleine Zusatzfunktion für die Speicherung mitbringt.

1. Die beigefügte ZIP-Datei **auf deinem Computer entpacken** (Doppelklick auf die ZIP, bei Windows: Rechtsklick → "Alle extrahieren")
2. Es entsteht ein Ordner mit `index.html` und einem Unterordner `functions/`
3. In Cloudflare: dein Projekt → **"Bereitstellung erstellen"**
4. Diesmal auf **"Ordner"** klicken (nicht "Datei") und den **entpackten Ordner** auswählen (nicht die ZIP-Datei selbst!)
5. Hochladen → **"Speichern und bereitstellen"**

## Testen

Nach dem Deploy: Link öffnen, einen Namen auswählen, ein Treppenhaus bewerten, absenden. Dann die Seite neu laden (oder auf einem anderen Gerät öffnen) – die Bewertung sollte weiterhin da sein. Wenn ja, funktioniert die Speicherung jetzt richtig.

## Falls "Absenden" immer noch nichts tut

Öffne die Website, drücke **F12** (bzw. am Handy schwieriger – dann am Laptop testen), gehe zum Tab **"Console"**, und schau nach roten Fehlermeldungen beim Draufdrücken von "Absenden". Ein Screenshot davon hilft mir, den Fehler einzugrenzen.
