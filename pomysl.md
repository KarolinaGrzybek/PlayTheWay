# Projekt Zaliczeniowy: Rodzinna Aplikacja Turystyczna (Gra Paragrafowa AI)
**Zapis konwersacji (Burza mózgów i Architektura)**

---

## 🧑‍💻 Użytkownik
Studiuje sztuczną inteligencję w automatyzacji biznesu. Jako projekt zaliczeniowy chciałabym stworzyć aplikację / stronę internetową o podróżowaniu/zwiedzaniu ale od strony rodzin - rodzice i dzieci w róznym wieku (chciałabym żeby dzieci były podzielone na trzy kategorie wiekowe). Moja idea jest taka żeby wpisywało się jakie miasto, miejsce chce się zwiedzić a aplikacja generowałaby trasę i scenariusz przygody która urozmaicałaby zwiedzanie dziecka tak żeby się nie nudziło. Wszystkie dodatkowe tipy i gadżety mile widziane. Chciałabym żeby było to coś w rodzaju gry paragrafowej itp. Bądź krytyczny - czy taki projekt ma szanse się udać i z czego musiałabym skorzystać? Najlepiej jakby był oparty o n8n bo to narzedzie znam

---

## 🤖 AI (Gemini)
To fantastyczny pomysł na projekt zaliczeniowy! Rozwiązuje bardzo realny i bolesny problem wielu rodziców: jak zwiedzać nowe miejsca, by dzieci nie marudziły, że bolą je nogi, a jednocześnie samemu zobaczyć coś ciekawego. Połączenie AI z grywalizacją (gra paragrafowa) w turystyce to strzał w dziesiątkę, idealnie wpisujący się w automatyzację procesów.

Prosiłaś jednak o krytyczne spojrzenie, więc przejdźmy do konkretów. Ocenimy szanse tego projektu i rozbierzemy go na czynniki pierwsze.

### Krytyczna ocena pomysłu

Jako prototyp na zaliczenie (MVP) – projekt ma **100% szans na sukces** i na pewno zrobi wrażenie na wykładowcach. Jeśli jednak myślisz o nim w kontekście realnego, działającego produktu (nawet testowanego przez znajomych), musisz uważać na trzy duże pułapki:

*   **Halucynacje AI (największe ryzyko):** Modele językowe nagminnie zmyślają. AI może wymyślić, że obok krakowskich Sukiennic stoi "magiczna fontanna z fioletową wodą", której tam nie ma. Dziecko będzie jej szukać i się rozczaruje. System musi opierać się na twardych danych geograficznych, a AI powinno jedynie "ubierać" je w fabułę.
*   **Problemy z routingiem (logistyka):** AI nie ma pojęcia o fizycznych odległościach. Może wygenerować trasę, która zakłada przejście 5 kilometrów w 15 minut albo poprowadzi przez ruchliwą autostradę.
*   **Zarządzanie stanem (pamięć gry):** Gra paragrafowa wymaga pamiętania, co użytkownik wybrał w poprzednim kroku. N8n jest domyślnie bezstanowe (stateless) – uruchamia proces i go kończy. Będziesz musiała gdzieś zapisywać historię rozgrywki.

### Architektura rozwiązania: Z czego musisz skorzystać?

Skoro znasz i chcesz wykorzystać **n8n**, to świetnie. Będzie on sercem Twojej aplikacji (tzw. orkiestratorem), który połączy wszystkie klocki w jedną całość. 

Oto niezbędny stos technologiczny (Tech Stack):

#### 1. Interfejs Użytkownika (Frontend)
Rodzice i dzieci będą korzystać z tego w ruchu, na ulicy. Tradycyjna strona www może być niewygodna. 
*   **Komunikator (Telegram / WhatsApp):** Najprostsze do spięcia z n8n. Możesz stworzyć bota, który pyta o miasto, wiek dzieci, a następnie prowadzi grę wysyłając kolejne wiadomości i przyciski (np. "Idziemy do smoka" / "Szukamy ukrytego skarbu").
*   **Low-Code Web App (Glide / Softr):** Jeśli wolisz tradycyjną aplikację webową (PWA), te narzędzia pozwalają szybko wyklikać interfejs i łatwo łączą się z n8n przez Webhooki.

#### 2. Silnik AI (Mózg)
*   **OpenAI (GPT-4o) lub Anthropic (Claude 3.5 Sonnet):** Modele idealne do tworzenia kreatywnych historii. W n8n użyjesz węzłów AI Agents do komunikacji z ich API.

#### 3. Twarde dane i Mapy (Uziemienie AI)
*   **Google Places API / TripAdvisor API:** Zanim n8n wyśle zapytanie do AI o stworzenie historii, musi pobrać listę prawdziwych, istniejących punktów w promieniu np. 2 km od użytkownika (np. "Zamek", "Pomnik psa", "Stara apteka"). AI musi bazować **tylko** na tej liście.

#### 4. Baza Danych (Pamięć gry)
*   **Airtable, Supabase lub Google Sheets:** W n8n musisz stworzyć logikę, która po każdym wyborze w grze zapisze ID użytkownika, jego aktualną lokalizację i etap scenariusza. Przy kolejnej wiadomości n8n odpyta bazę, aby wiedzieć, w którym momencie opowieści znajduje się rodzina.

### Jak podzielić wiek dzieci (Propozycja promptowania)

W n8n stworzysz różne ścieżki promptów (system prompts) w zależności od wybranej kategorii wiekowej:

*   **Maluchy (3-6 lat) - "Magiczni Przyjaciele":** Scenariusz oparty na poszukiwaniu kolorów, zwierzątek i prostych zadaniach ruchowych. (np. "Krasnal zgubił czerwoną czapkę, poszukajmy 3 czerwonych rzeczy na tym rynku").
*   **Dzieci (7-11 lat) - "Łowcy Przygód":** Fabuła przygodowa, zagadki detektywistyczne, ratowanie kogoś, szukanie ukrytych symboli na budynkach. Wymaga dedukcji i fizycznego zaangażowania.
*   **Nastolatki (12-15 lat) - "Mroczne Tajemnice / Urban Fantasy":** Zwykłe zwiedzanie ich zanudzi. Scenariusz powinien opierać się na miejskich legendach, dreszczyku emocji, ciekawostkach historycznych typu "true crime" lub elementach wirtualnego Escape Roomu.

### Ekstra "Tipy i Gadżety" (Punkty za kreatywność na zaliczeniu)

*   **Generowanie głosu (Text-to-Speech):** Podłącz API **ElevenLabs** w n8n. Zamiast czytać tekst, rodzic może odtworzyć dziecku z telefonu głos "starego króla" lub "pirata", który opowiada legendę o danym miejscu. To niesamowicie zwiększa immersję!
*   **Generowanie obrazów:** Wykorzystaj DALL-E 3 (przez n8n), aby na bieżąco generować obrazki potworów lub magicznych przedmiotów ukrytych rzekomo w prawdziwych lokacjach, które właśnie mijacie.
*   **Integracja z pogoda (OpenWeather API):** Dodaj węzeł sprawdzający pogodę. Jeśli pada deszcz, n8n automatycznie wygeneruje scenariusz prowadzący przez zadaszone bramy, muzea czy kawiarnie.

Czytając o Twoim pomyśle i umiejętnościach związanych z n8n, uważam, że jesteś na świetnej drodze. Co wydaje Ci się łatwiejsze na start: budowa bota na Telegramie/WhatsAppie, który reaguje na komendy tekstowe, czy wolałabyś stworzyć prostą stronę z przyciskami do wyklikiwania gry?

---

## 🧑‍💻 Użytkownik
Pomóż mi stworzyć główny prompt systemowy dla LLM (tzw. System Prompt), który będzie zarządzał logiką gry paragrafowej i zapobiegał halucynacjom AI. Zaproponuj też strukturę tabel w bazie danych (np. Airtable), której będzie używał n8n.

---

## 🤖 AI (Gemini)
To kluczowy moment Twojego projektu. Dobry System Prompt (instrukcja główna dla modelu) to Twoja najlepsza polisa ubezpieczeniowa przed halucynacjami, a dobrze zaprojektowana baza danych to fundament, który pozwoli n8n płynnie zarządzać grą.

Zacznijmy od bazy danych, ponieważ to ona zdefiniuje, jakie informacje będziemy przekazywać do LLM w prompcie.

### 1. Struktura Bazy Danych (Airtable / Supabase)

Do obsługi gry paragrafowej w bezstanowym n8n potrzebujesz bazy, która działa jako "pamięć podręczna" dla każdej rodziny. Wystarczą **dwie tabele**.

#### Tabela 1: `Aktywne_Sesje` (Active Sessions)
Ta tabela przechowuje aktualny stan gry dla konkretnego użytkownika.
*   **Session_ID (Primary Key):** Np. numer telefonu z WhatsAppa lub unikalny ID z aplikacji webowej.
*   **Age_Group:** Kategoria wiekowa (np. `3-6`, `7-11`, `12-15`).
*   **City:** Miasto, w którym toczy się gra (np. `Kraków`).
*   **Current_Theme:** Motyw gry (np. `Magiczni Przyjaciele`, `Łowcy Przygód`).
*   **Story_Summary:** Krótkie podsumowanie tego, co wydarzyło się do tej pory (n8n będzie aktualizować to pole po każdym kroku, by AI "pamiętało" kontekst, nie zużywając ogromnej ilości tokenów na całą historię).
*   **Status:** `W_trakcie` / `Zakończona`.

#### Tabela 2: `Historia_Krokow` (Step History)
Ta tabela to logika "paragrafów". Zapisuje każdy pojedynczy krok.
*   **Step_ID:** Autonumeracja.
*   **Session_ID:** Powiązanie z tabelą sesji (Link to Record).
*   **Timestamp:** Czas wykonania kroku.
*   **Real_Location_Name:** Rzeczywiste miejsce pobytu (np. `Brama Floriańska`), przekazane przez API map.
*   **User_Choice:** Co kliknął/wpisał użytkownik w poprzednim kroku (np. `Idziemy w lewo do smoka`).
*   **AI_Response:** Pełna treść wygenerowana przez AI w danym kroku.

**Jak to działa w n8n:** Kiedy użytkownik wysyła wiadomość, n8n sprawdza `Session_ID` w Airtable. Pobiera `Age_Group` i `Story_Summary`. Następnie zaciąga z API map listę miejsc w okolicy. Wszystko to pakuje w zmienne i wysyła do LLM wraz z System Promptem.

### 2. Główny System Prompt (The Master Prompt)

Ten prompt jest zaprojektowany tak, aby zmuszał model do zwracania danych w formacie **JSON**. Dzięki temu n8n łatwo wyciągnie tekst do pokazania użytkownikowi oraz opcje do przycisków, bez ryzyka, że model doda od siebie "Oto twoja odpowiedź:".

Możesz wkleić ten tekst do węzła AI w n8n (np. OpenAI / Anthropic), zastępując wartości w wąsach `{{ }}` zmiennymi z poprzednich węzłów.

```text
Jesteś Mistrzem Gry (Game Master) i interaktywnym przewodnikiem turystycznym w aplikacji dla rodzin. Twoim zadaniem jest prowadzenie wciągającej gry terenowej (tzw. gry paragrafowej).

Oto parametry Twojej obecnej sesji:
- Grupa wiekowa dzieci: {{Age_Group}}
- Motyw fabularny: {{Current_Theme}}
- Miasto: {{City}}
- Dotychczasowe streszczenie przygody: {{Story_Summary}}
- Ostatni wybór gracza: {{User_Choice}}

DOSTĘPNE RZECZYWISTE PUNKTY (POIs) W OKOLICY:
{{Real_Places_JSON_from_Google_Maps}}

ZASADY KRYTYCZNE (BEZWZGLĘDNIE PRZESTRZEGAJ):
1. ZERO HALUCYNACJI GEOGRAFICZNYCH: Twórz fabułę TYLKO i WYŁĄCZNIE w oparciu o miejsca podane w sekcji "DOSTĘPNE RZECZYWISTE PUNKTY". Nie wymyślaj budynków, pomników ani ulic, których tam nie ma. 
2. Magię i fabułę "nakładaj" na rzeczywistość. (Np. jeśli w POI jest "Kawiarnia pod Różą", możesz powiedzieć, że w środku czeka informator, ale nie mów, że obok kawiarni stoi magiczna wieża, jeśli jej nie ma w danych).
3. TON I STYL: Dostosuj język do grupy wiekowej ({{Age_Group}}). Dla maluchów bądź entuzjastyczny i prosty. Dla 7-11 latków używaj języka przygody i tajemnicy. Dla nastolatków bądź intrygujący, dodawaj mroczniejsze ciekawostki historyczne i traktuj ich jak partnerów.
4. MECHANIKA GRY: Zawsze kończ swoją odpowiedź dając graczom DOKŁADNIE DWIE opcje wyboru (kolejne kroki), które prowadzą do dwóch RÓŻNYCH punktów z listy POIs.
5. EDUKACJA: Przemyć w opisie przynajmniej jedną fascynującą, prawdziwą ciekawostkę historyczną o miejscu, w którym obecnie znajdują się gracze.

FORMAT ODPOWIEDZI:
Musisz zwrócić odpowiedź WYŁĄCZNIE w poprawnym formacie JSON, bez żadnego formatowania Markdown czy tekstu wprowadzającego. Użyj poniższej struktury:

{
  "narrative_text": "Tutaj wpisz barwny opis fabularny dla graczy wraz z wplecioną ciekawostką (max 150 słów).",
  "updated_story_summary": "Krótkie, jednozdaniowe streszczenie uwzględniające ten krok (do zapisu w bazie danych).",
  "choices": [
    {
      "button_text": "Krótki tekst na przycisk 1 (max 4 słowa)",
      "target_location": "Nazwa miejsca z listy POI",
      "action_description": "Co zrobicie? (np. 'Zbadajmy tajemnicze drzwi kościoła')"
    },
    {
      "button_text": "Krótki tekst na przycisk 2 (max 4 słowa)",
      "target_location": "Inna nazwa miejsca z listy POI",
      "action_description": "Co zrobicie? (np. 'Poszukajmy śladów przy starym pomniku')"
    }
  ]
}