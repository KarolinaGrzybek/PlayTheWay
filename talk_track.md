# PlayTheWay - Talk Track (Skrypt wystąpienia)

Zalecam nie uczyć się tego na pamięć słowo w słowo, lecz traktować to jako płynne notatki prowadzące przez całą historię powstania Twojej aplikacji. Postaw na pewność siebie – walczyłaś z trudnymi technologiami i doprowadziłaś to do końca!

---

**Slajd 1: Strona tytułowa**
"Dzień dobry, nazywam się [Twoje Imię i Nazwisko] i chciałabym zaprezentować mój projekt zaliczeniowy o nazwie PlayTheWay. Jest to aplikacja łącząca geolokalizację z zaawansowanymi modelami językowymi, której celem jest zamiana każdego miejskiego spaceru w interaktywną grę fabularną."

**Slajd 2: Problem i Rozwiązanie**
"Pomysł narodził się z prostej obserwacji – dzieci spędzają dziś mnóstwo czasu przed ekranami, a tradycyjne, bierne formy zwiedzania miasta czy wyjścia na spacer rzadko są dla nich atrakcyjne. Rozwiązaniem, które przygotowałam, jest aplikacja dynamicznie generująca scenariusze gry RPG, osadzone w rzeczywistości. Zamiast pisać i przygotowywać trasy z góry, system sam pobiera lokalizacje i przy pomocy Sztucznej Inteligencji tworzy nieskończone, unikalne historie na bieżąco, prowadząc gracza od punktu do punktu."

**Slajd 3: Tech Stack (Ekosystem)**
"Architektura projektu opiera się na kilku warstwach połączonych ze sobą w czasie rzeczywistym. Od strony frontendowej mamy nowoczesną i responsywną aplikację napisaną w bibliotece React. Cały stan gry, w tym m.in. ekwipunek zdobyty przez gracza i jego postępy, przetrzymywany jest w chmurowej bazie Supabase. Jednak prawdziwym 'sercem' tego układu jest backend oparty na platformie n8n, który pełni rolę głównego orkiestratora – to tam zespawałam bazę danych, zewnętrzne API mapowe oraz model językowy Google Gemini."

**Slajd 4: Integracja danych zewnętrznych (Geodata)**
"Zależało mi na tym, żeby aplikacja nie była sztucznie 'przyspawana' do jednego miasta i by w pełni skalowała się na każdą inną lokację. Skąd więc system wie, co otacza gracza? Aplikacja dynamicznie odpytuje serwer Nominatim o współrzędne miasta, a następnie, wykorzystując skomplikowane zapytania do bazy OpenStreetMap przez Overpass API, wyciąga pobliskie zabytki, skwery czy atrakcje turystyczne. Za pomocą napisanej przeze mnie implementacji algorytmu Haversine'a, system samodzielnie mierzy odległości od gracza, sortuje te punkty i wybiera najbliższe opcje."

**Slajd 5: Rola AI w systemie (Dynamiczny Mistrz Gry)**
"Przejdźmy teraz do najważniejszego elementu technicznego – wykorzystania LLM. W moim projekcie model Gemini nie służy po prostu jako 'zwykły chatbot, z którym można popisać'. Pełni on rolę zamkniętego w skrypcie silnika decyzyjnego – wirtualnego Mistrza Gry. Przepływ w n8n automatycznie wysyła do modelu absolutnie precyzyjny kontekst: wiek gracza, zebrane dotąd przez niego łupy oraz konkretną historyczną lokację z Overpassa. Na podstawie tego pakietu zmiennych model ma za zadanie wygenerować w locie nową opowieść posuwającą fabułę do przodu."

**Slajd 6: Prompt Engineering i Guardrails**
"Jak zapewne Państwo wiedzą, praca z modelami LLM w deterministycznym kodzie to ogromne wyzwanie inżynieryjne. Modele językowe często tzw. 'halucynują' lub generują zadania frustrujące i nudne. Zbudowałam więc kompleksowy, rygorystyczny system reguł – tzw. Guardrails. Narzuciłam Sztucznej Inteligencji całkowity zakaz generowania jakichkolwiek łamigłówek matematycznych czy językowych, oraz nałożyłam bezwzględny wymóg opierania się wyłącznie na faktach o lokacjach, aby uniknąć zmyślania historii. Wymusiłam również na modelu formatowanie słownictwa w czasie rzeczywistym w zależności od wieku gracza."

**Slajd 7: Wymuszanie Struktury Danych (Structured Output)**
"Samo posiadanie wytycznych tekstowych to jednak za mało – system nie miał prawa się wysypać, gdyby AI zdecydowało się zwrócić nieoczekiwany tekst. Aplikacja frontendowa musiała otrzymać z n8n stabilny obiekt danych. Skonfigurowałam specjalne węzły wymuszające na modelu zwracanie odpowiedzi w ściśle zdefiniowanym schemacie JSON, podzielonym na fabułę, nagrodę i cel questu. Dodatkowo w n8n zaimplementowałam skrypty JavaScript (tzw. parsery i walidatory), które analizują, czy AI nie zaszyło ukrytego obiektu głęboko pod warstwami tekstowymi, skutecznie chroniąc aplikację przed błędami dekodowania."

**Slajd 8: Krótkie Demo / Flow Gracza**
"Na tych zrzutach ekranu widzimy, jak cała ta teoria perfekcyjnie działa w praktyce. Gracz dociera na przykład pod 'Tajemniczą Kamienicę'. React pyta n8n o dalszy rozwój historii. n8n angażuje Gemini i odpytuje go na bazie przygotowanego kontekstu, waliduje JSON-a, uaktualnia bazę danych Supabase i oddaje z powrotem na front pełny, sformatowany wynik. Gracz dostaje w ten sposób wciągający opis, dedykowane dla niego zadanie pozbawione matematyki oraz nagrodę, po czym sam decyduje, do którego prawdziwego miejsca chce pójść dalej."

**Slajd 9: Wyzwania i Wnioski z realizacji**
"Największym wyzwaniem inżynieryjnym w tym projekcie było ewidentnie okiełznanie chaosu, jaki generuje wplecenie probabilistycznego modelu językowego do sztywnego obiegu danych w backendzie. Walka o poprawne parsowanie zagnieżdżonych struktur JSON wyrzucanych z Gemini oraz synchronizacja asynchronicznych zapytań (do OpenStreetMap, modelu i Supabase) na raz – wymagały wielokrotnego poprawiania logiki i tworzenia ścieżek zabezpieczających (tzw. fallbacków)."

**Slajd 10: Podsumowanie**
"Dzięki stworzeniu tej złożonej architektury, udało mi się zbudować narzędzie, które udowadnia, że dzisiejsze modele językowe z powodzeniem dają się wdrożyć w bardzo sztywne ramy systemów bazodanowych, by połączyć świat magii i kodowania z interakcją w świecie fizycznym. Dziękuję za uwagę i chętnie odpowiem na wszelkie pytania."
