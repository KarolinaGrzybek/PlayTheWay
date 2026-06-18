# Instrukcja wdrożenia n8n na platformie Railway

Ta instrukcja opisuje, jak krok po kroku przenieść lokalne środowisko n8n do chmury **Railway**, aby Twoja gra turystyczna wdrożona na **Vercel** mogła z niego korzystać przez całą dobę (24/7).

---

## Krok 1: Wdrożenie n8n na Railway

1. Wejdź na stronę **[railway.app](https://railway.app/)** i zaloguj się (najlepiej za pomocą swojego konta **GitHub**).
2. Kliknij przycisk **+ New Project** (lub przejdź do swojego *Dashboard* -> *New Project*).
3. Wybierz opcję **Deploy from Template**.
4. Wpisz w wyszukiwarkę **n8n** i wybierz popularny szablon o nazwie **n8n** (ten, który w opisie ma informację, że instaluje zarówno usługę `n8n`, jak i bazę danych `PostgreSQL`).
5. Railway poprosi Cię o konfigurację zmiennych. Zazwyczaj szablon ma już wszystko skonfigurowane automatycznie. Zwróć tylko uwagę na zmienną:
   * `N8N_ENCRYPTION_KEY` – jeśli szablon wymaga jej podania, wpisz dowolny losowy ciąg znaków (możesz skopiować klucz ze swojego lokalnego pliku `docker-compose.yml`: `NI9rkth6wp7gY2eF76jXLPPDtUqVlBJf`).
6. Kliknij **Deploy**. Railway rozpocznie pobieranie i uruchamianie kontenerów (potrwa to około 2-3 minut).

---

## Krok 2: Konfiguracja adresu Webhooka w Railway

n8n musi znać swój publiczny adres URL, aby poprawnie rejestrować i odbierać webhooki z frontendu. Zmienne te konfigurujemy w panelu **Railway**, a nie bezpośrednio w aplikacji n8n.

1. Wejdź do swojego projektu na stronie **[railway.app](https://railway.app/)**.
2. Kliknij w klocek usługi o nazwie **n8n**.
3. W menu usługi (po prawej stronie lub na środku ekranu) przejdź do zakładki **Settings** i znajdź sekcję **Networking**. Zobaczysz tam wygenerowaną publiczną domenę (np. `https://n8n-production-xxxx.up.railway.app`). Skopiuj ten adres.
4. Teraz przejdź do zakładki **Variables** (oznaczonej ikoną `$`) znajdującej się w tym samym panelu usługi **w Railway**.
5. Sprawdź, czy na liście znajduje się zmienna `WEBHOOK_URL`.
   * **Jeśli nie istnieje:** Kliknij **+ Add Variable**, jako nazwę wpisz `WEBHOOK_URL`, a jako wartość wklej skopiowany adres URL (bez ukośnika na końcu, np. `https://n8n-production-xxxx.up.railway.app`).
   * **Jeśli istnieje** i jej wartość to np. `https://${{RAILWAY_PUBLIC_DOMAIN}}` – oznacza to, że Railway sam dynamicznie podstawi właściwy adres i nic nie musisz zmieniać.

---

## Krok 3: Import projektu i konfiguracja kluczy w nowym n8n

1. Otwórz w nowej karcie przeglądarki adres swojego n8n z Railway (ten skopiowany w Kroku 2).
2. Przy pierwszym wejściu system poprosi Cię o **utworzenie konta właściciela** (podaj e-mail i bezpieczne hasło – zapisz je sobie!).
3. Po zalogowaniu przejdź do zakładki **Workflows** w lewym menu i kliknij **Add workflow** (lub *New workflow*).
4. Kliknij na ikonę trzech kropek w prawym górnym rogu ekranu i wybierz **Import from file**.
5. Wybierz plik z dysku komputera: `Archiwum/PlayTheWay - Gra Paragrafowa v1 (3).json`.
6. **Podpięcie klucza Gemini:**
   * Znajdź w zaimportowanym schemacie fioletowy węzeł o nazwie **Message a model** (odpowiedzialny za kontakt z Gemini).
   * Kliknij na niego dwukrotnie.
   * W sekcji *Credential for Google Gemini(PaLM) API* rozwiń listę i wybierz *Create New Credential*.
   * Wklej tam swój darmowy klucz API wygenerowany w Google AI Studio.
7. Zapisz przepływ (skrótem Ctrl+S lub przyciskiem **Save** w prawym górnym rogu).
8. Uruchom przepływ, przełączając przełącznik w prawym górnym rogu na pozycję **Active**.

---

## Krok 4: Połączenie z Vercel

Ostatnim krokiem jest przekazanie nowego adresu webhooka do Twojej aplikacji frontendowej.

1. Wejdź na [vercel.com](https://vercel.com) i otwórz panel swojego projektu.
2. Przejdź do zakładki **Settings** -> **Environment Variables**.
3. Znajdź zmienną `VITE_N8N_WEBHOOK_URL` (lub stwórz ją, jeśli jej nie ma) i zmień jej wartość na:
   `https://[TWÓJ-URL-Z-RAILWAY]/webhook/playtheway`
   *(Upewnij się, że końcówka to dokładnie `/webhook/playtheway`)*.
4. Przejdź do zakładki **Deployments** w panelu projektu na Vercelu.
5. Kliknij trzy kropki obok ostatniego wdrożenia i wybierz **Redeploy** (a następnie potwierdź).

Po ponownym zbudowaniu aplikacji na Vercelu gra będzie w pełni sprawna i gotowa do testowania przez każdego użytkownika w internecie!
