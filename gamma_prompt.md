# PlayTheWay: Interaktywna Miejska Gra Fabularna z AI
## Prezentacja Projektu Zaliczeniowego

---

## Slajd 1: Strona tytułowa
**Tytuł:** PlayTheWay - Zmień każdy spacer w epicką przygodę
**Podtytuł:** Projekt zaliczeniowy z wykorzystaniem Google Gemini, React i n8n.
**Wskazówka wizualna dla Gamma:** Duże, kolorowe logo aplikacji PlayTheWay. Styl nowoczesny, lekko gamingowy i magiczny.

---

## Slajd 2: Problem i Rozwiązanie (Dlaczego to stworzyłam?)
**Problem:** Dzieci spędzają dużo czasu przed ekranami, a tradycyjne spacery czy turystyczne zwiedzanie miast są dla nich po prostu nudne.
**Rozwiązanie:** Dynamicznie generowane scenariusze gier terenowych (RPG) z wykorzystaniem prawdziwych danych z map miast oraz AI jako wirtualnego, adaptującego się "Mistrza Gry".
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Wstaw tutaj zrzut ekranu z głównego widoku Twojej aplikacji, np. tego ekranu gdzie jest wybór lokalizacji lub ładny, startowy widok UI.

---

## Slajd 3: Architektura Systemu (Ekosystem)
**Tytuł:** Tech Stack - Jak to działa pod maską?
* **Frontend:** Nowoczesny i responsywny interfejs w React.
* **Baza Danych:** Supabase (rejestracja, przechowywanie stanu gry, ekwipunek).
* **Orkiestracja & AI:** Pętla decyzyjna w n8n połączona z modelem Google Gemini.
* **Geolokacja:** API Nominatim + Overpass (dynamiczne pobieranie zabytków i parków).
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Wklej tutaj wycinek Twojego workflow (scenariusza) z n8n – ten moment, w którym strzałki rozchodzą się do wielu węzłów bazy danych. To robi wrażenie profesjonalnego backendu!

---

## Slajd 4: Geodata - Jak AI orientuje się w terenie?
* System PlayTheWay nie jest przypisany do żadnego konkretnego miasta na sztywno.
* Aplikacja odpytuje OpenStreetMap w ułamku sekundy dla dowolnych współrzędnych gracza.
* Wydobywa okoliczne pomniki, skwery, dziedzińce i budynki.
* Oblicza odległości algorytmem Haversine'a i filtruje najlepsze opcje trasy.
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Minimalistyczny zrzut ekranu lub mock z mapy z Twojej aplikacji (lub ewentualnie grafika "geolokalizacyjna" wygenerowana przez Gammę).

---

## Slajd 5: Rola AI w systemie (Dynamiczny Mistrz Gry)
* Model Google Gemini nie funkcjonuje tutaj jako zwykły chatbot. Został zintegrowany jako silnik gry.
* System ułamki sekund przed wygenerowaniem treści przesyła do AI "paczki wiedzy": 1. Dokładny wiek gracza, 2. Zebrane dotychczas w plecaku łupy, 3. Informacje z Overpass API o obiekcie przed którym się fizycznie znajdujemy.
* W odpowiedzi generuje w 100% unikalną bajkę, zadanie i nową zdobycz.
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Zrzut ekranu na którym pokazujesz wylosowaną, piękną bajkę o "Tajemniczej Kamienicy" (widok karty questu w aplikacji).

---

## Slajd 6: Prompt Engineering i Guardrails (Bezpieczeństwo)
**Jak okiełznałam AI by nie denerwowało dzieci:**
* **Blokada Matematyki:** Surowy, dopracowany do perfekcji zakaz łamigłówek z dodawania i zagadek stricte językowych.
* **Eliminacja Halucynacji:** Absolutny zakaz "zmyślania" faktów historycznych. Jeśli jesteśmy przed dębem, w zagadce musi być dąb.
* **Dostosowanie języka:** Sztuczna inteligencja musi dopasowywać stopień skomplikowania słownictwa na bieżąco, jeśli ma do czynienia z np. 5-7 latkiem.
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Wklej tu ładny, wykadrowany print-screen tekstu z Twojego węzła n8n, tam gdzie widać wielkimi literami `=- CAŁKOWITY ZAKAZ` i te świetne tagi xml-owe. Pokazuje to zaawansowany "Prompt Engineering".

---

## Slajd 7: Wymuszanie Struktury Danych (JSON Output)
* Połączenie sztucznej inteligencji z "tradycyjnym kodem" nie mogłoby działać w oparciu o czysty tekst. 
* Oparcie zapytań o węzły typu LangChain i wymuszenie trybu zwracania surowego obiektu.
* Wykorzystanie zaawansowanych, naprawczych parserów JavaScript w n8n – aplikacja frontowa otrzymuje odseparowane klucze jak `narrative_text`, `item_found` i dodaje łupy bezpośrednio do Supabase.
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Zrzut ekranu z Konsoli deweloperskiej w Twojej przeglądarce (F12), pokazujący obiekt (ten moment `[object Object]` który rozgryzaliśmy) wracający poprawnie do aplikacji!

---

## Slajd 8: Działanie w Praktyce (Flow Gracza)
1. Gracz aktywuje zagadkę pod wybranym punktem.
2. Interakcja z n8n generuje wyzwanie bez matematyki.
3. Wybór odpowiedniej akcji (guziki opcji w aplikacji).
4. Epicki klejnot trafia na własność gracza a postęp zostaje zapisany!
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Zrzut ekranu otwartego plecaka (ekwipunku) z jakimiś diamentami lub złotymi mieczami zdobytymi w Twojej grze.

---

## Slajd 9: Największe Wyzwania Inżynierskie
* Zapanowanie nad potężną asynchronicznością całego układu.
* Zabezpieczenie aplikacji na wypadek, gdy model LLM zaszywa wygenerowanego JSON'a w bardzo głębokich, tekstowych i nieprzewidzianych wcześniej strukturach (tablice parts/content).
* Obsługa logiki odległości geograficznych i stanu sesji w chmurze jednocześnie.
**Wskazówka wizualna dla Gamma:** Tutaj poproś Gammę o ciemne, technologiczne tło, lekko w stylu hakera.

---

## Slajd 10: Podsumowanie projektu
* Aplikacja udowadnia, że dzisiejsze modele językowe można okiełznać w ścisłych regułach kodowania.
* Technologia gotowa do grywalizacji dowolnego miasta.
* Dziękuję za uwagę!
**Wskazówka wizualna dla Gamma / [MIEJSCE NA TWOJE ZDJĘCIE]:** Wklej w to miejsce wielki, działający Kod QR. Zrób go w jakimś darmowym generatorze w Google. Jeśli ktoś na obronie wyciągnie telefon i sam otworzy aplikację, od razu zdajesz na 5.0!
