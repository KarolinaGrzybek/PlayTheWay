# Prompt do wygenerowania prezentacji w Gamma.app (AI, Prompt Engineering i Bezpieczeństwo)

Skopiuj poniższy tekst i wklej go do Gamma.app (opcja generowania z tekstu), aby stworzyć 10-slajdową prezentację. Ta wersja łączy tematykę inżynierii promptów i wprowadza dedykowany slajd poświęcony bezpieczeństwu danych oraz ochronie przed manipulacją AI.

---

```text
Stwórz profesjonalną prezentację akademicką na obronę projektu studenckiego.
Temat projektu: "PlayTheWay - Inteligentny Mistrz Gry oparty na AI i danych geograficznych".
Prezentacja musi składać się dokładnie z 10 slajdów.
Styl: Naukowy, nowoczesny, minimalistyczny, schematy blokowe i jasne zestawienia tekstowe.
Język: Polski.
Ton: Koncentrujący się na Sztucznej Inteligencji, bezpieczeństwie oraz inżynierii promptów (Prompt Engineering), bez żargonu programistycznego.

Poniżej znajduje się szczegółowy opis zawartości każdego z 10 slajdów:

---

Slajd 1: Strona tytułowa projektu
- Tytuł: PlayTheWay: Wykorzystanie LLM jako Autonomicznego Mistrza Gry w Edukacji Terenowej
- Podtytuł: Integracja modeli językowych i danych geograficznych do generowania przygód w czasie rzeczywistym
- Kontekst: Projekt zaliczeniowy z obszaru Sztucznej Inteligencji i Systemów Decyzyjnych

Slajd 2: Idea projektu (Statyczne przewodniki vs. Adaptacyjne AI)
- Kontekst: Tradycyjne zwiedzanie miast przez rodziny z dziećmi szybko staje się nudne. Pasywne opisy nie angażują młodych odbiorców.
- Alternatywa tradycyjna: Scenariusze gier pisane przez ludzi są ograniczone, powtarzalne i czasochłonne w tworzeniu.
- Rozwiązanie (PlayTheWay): Autonomiczny agent AI wcielający się w rolę Mistrza Gry (Game Mastera), który na bieżąco generuje wciągającą fabułę i zagadki dostosowane do realnych punktów w mieście i wieku uczestników.

Slajd 3: Przepływ danych w n8n (AI Orchestration)
- Tytuł: Serwer n8n jako szyna danych i orkiestrator sztucznej inteligencji
- Opis przepływu (Core Loop):
  1. Wejście: System pobiera aktualną lokalizację gracza i jego wybór z aplikacji.
  2. Uziemienie (Grounding): Baza danych mapowych pobiera najbliższe atrakcje (pomniki, zabytki) w promieniu 1 km.
  3. AI Generator: Wszystkie dane (profil, historia wyprawy, opcje drogi) trafiają do modelu językowego.
  4. Wyjście: AI decyduje o kolejnym kroku, wynik zapisuje się w bazie danych, a gracz otrzymuje nową zagadkę.

Slajd 4: Uziemienie AI w rzeczywistości (Geodata Grounding)
- Tytuł: Rozwiązanie problemu halucynacji poprzez "uziemienie" danymi
- Wyzwanie: Modele LLM mają skłonność do zmyślania nieistniejących miejsc i faktów (halucynacje).
- Rozwiązanie: System pobiera rzeczywiste dane z otwartej mapy (OpenStreetMap). Zanim prompt trafi do AI, n8n wyciąga nazwy i opisy dwóch najbliższych fizycznych miejsc.
- Efekt: AI otrzymuje surowe, prawdziwe dane jako jedyny dozwolony kontekst do stworzenia opowieści. Nie może wymyślić nowej lokacji – musi powiązać fabułę z tym, co gracz faktycznie widzi przed sobą w mieście.

Slajd 5: Inżynieria Promptów i Personalizacja Wieku
- Tytuł: Struktura promptu systemowego i dopasowanie do rozwoju poznawczego dzieci
- Rola promptu: Przekształcenie ogólnego modelu językowego w bezpiecznego narratora gry RPG za pomocą sztywnego kontekstu i reguł.
- Wstrzykiwany prompt dla grupy 5-7 lat (Mali Odkrywcy):
  "Jesteś radosnym bajkowym przewodnikiem (krasnalem lub sówką). Używaj prostych słów i krótkich zdań. Akcja to bezpieczna przygoda (szukanie zgubionej czapki). Zadanie musi polegać na prostej obserwacji fizycznej: szukaniu koloru, liczeniu do trzech przed obiektem. ZERO strasznych elementów."
- Wstrzykiwany prompt dla grupy 7-11 lat (Poszukiwacze):
  "Jesteś detektywem lub odkrywcą. Twórz fabułę pełną tajemnic i szyfrów. Pomnik to skamieniały strażnik, brama to portal. Zadania wymagają dedukcji i szukania szczegółów (np. lwa)."
- Wstrzykiwany prompt dla grupy 11-14 lat (Mistrzowie):
  "Jesteś cynicznym badaczem zjawisk paranormalnych. Fabuła w klimacie miejskich legend i thrillera. Miejsca traktuj jako obszary anomalii energetycznych. Zadania sugerują dojrzałą analizę i eksplorację."

Slajd 6: Wymuszanie Struktury Danych (Structured Output)
- Tytuł: Zamiana tekstu w deterministyczne decyzje gry
- Problem: AI naturalnie generuje wolny tekst. Komputer nie potrafi automatycznie dodać przedmiotu do ekwipunku na podstawie opisowego zdania.
- Rozwiązanie: Wymuszenie formatu odpowiedzi w postaci obiektu danych JSON.
- Wymagane pola w odpowiedzi AI:
  - `narrative_text`: tekst opowieści i zagadki dla gracza.
  - `quiz`: obiekt zagadki (pytanie, 4 opcje do wyboru, indeks poprawnej odpowiedzi).
  - `item_found`: nazwa przedmiotu, który gracz dostaje (np. klucz, zwój) – automatycznie zapisywany w bazie.
  - `choices`: lista kolejnych realnych miejsc, do których gracz może pójść.

Slajd 7: Działanie Gry i Interfejs (Gamifikacja w praktyce)
- Tytuł: Przebieg rozgrywki z perspektywy użytkownika
- Interaktywna mapa: Wizualizacja punktów na mapie oraz dynamiczna ścieżka generowana przez AI.
- Dziennik Wypraw (Kronika): Zapisywanie ukończonych misji i pamiątkowych zdjęć na mapie.
- Aparat pamiątkowy: Moduł pozwalający graczom na zrobienie zdjęcia na koniec trasy z wirtualnymi nakładkami (np. kapelusz odkrywcy, puchar).
- System awatarów: Wybór postaci reprezentującej drużynę, trwale połączony z kontem gracza.

Slajd 8: Wyzwania w pracy z modelami językowymi
- Tytuł: Główne problemy integracji AI i sposoby ich rozwiązania
- Niestabilność odpowiedzi: Radzenie sobie z sytuacjami, gdy model mimo zakazów zwracał uszkodzony format lub ukrywał dane w dodatkowych blokach tekstowych (wdrożenie filtrów naprawczych w n8n).
- Zarządzanie pamięcią podręczną: Pamiętanie zebranych przedmiotów i historii kroków w bazie danych przy każdym nowym zapytaniu wysyłanym do AI.
- Optymalizacja opóźnień: Ustawienie parametrów modelu (temperatura, max tokens), aby skrócić czas oczekiwania na wygenerowanie kolejnego etapu przygody do kilku sekund.

Slajd 9: Bezpieczeństwo AI, ochrona przed manipulacją i prywatność
- Tytuł: Bezpieczeństwo systemu, moderacja treści i ochrona danych
- Ochrona przed manipulacją (Prompt Injection): Gracze mogą próbować wpływać na narrację poprzez sprytne wpisy w polach tekstowych (np. nazwa drużyny). System zabezpiecza to poprzez:
  - Walidację i sanityzację danych wejściowych w n8n przed przekazaniem ich do LLM.
  - Strukturę "Promptu Kanapkowego" (Sandwich Prompt) w n8n – instrukcje systemowe i filtry bezpieczeństwa są wymuszane na samym początku oraz powtórzone na końcu zapytania, co uniemożliwia nadpisanie zachowania AI przez użytkownika.
- Moderacja treści i odporność na błędy:
  - Konfiguracja filtrów bezpieczeństwa Gemini API (Safety Settings) na najwyższy poziom czułości dla kategorii: przemoc, mowa nienawiści, treści nieodpowiednie dla dzieci.
  - Mechanizm Fallback w n8n: w przypadku zablokowania odpowiedzi przez filtry AI, system automatycznie serwuje bezpieczną, predefiniowaną treść zastępczą bez przerywania gry.
- Zabezpieczenie danych uczestników (Zgodność z RODO/GDPR):
  - Efemeryczne przetwarzanie geolokalizacji: Współrzędne GPS służą wyłącznie jako tymczasowy parametr zapytania w n8n do wyszukania najbliższych punktów POI i nie są trwale zapisywane w bazie danych.
  - Minimalizacja danych osobowych: Brak konieczności podawania imion czy nazwisk dzieci. Profil gracza opiera się na wybranym awatarze (emoji), nazwie drużyny i randze. Zdjęcia pamiątkowe są chronione restrykcyjnymi polisami dostępu (RLS - Row Level Security) w bazie Supabase.

Slajd 10: Podsumowanie i dalszy rozwój AI w projekcie
- Tytuł: Podsumowanie wniosków i kierunki rozwoju sztucznej inteligencji
- Wnioski: Narzędzia AI i n8n pozwalają na stworzenie nieskończenie skalowalnej gry terenowej, w której scenariusze dopasowują się do gracza, zamiast być sztywno zaprogramowane.
- Plany rozwoju AI:
  - Integracja Text-to-Speech: Generowanie głosu lektora czytającego opowieści dzieciom.
  - Generowanie obrazów (np. DALL-E/Midjourney): Tworzenie ilustracji napotkanych postaci na żywo w trakcie gry.
  - Analiza wizyjna (VLM): Sprawdzanie przez AI, czy zrobione zdjęcie faktycznie przedstawia dany zabytek.
```
