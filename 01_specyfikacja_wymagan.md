# Karta Projektu i Specyfikacja Wymagań (PRD)
**Nazwa projektu:** PlayTheWay (Rodzinna Gra Paragrafowa AI)  
**Autor:** Karolina Grzybek
**Cel projektu:** Zaliczenie przedmiotu z wykorzystaniem automatyzacji biznesowych (n8n) i sztucznej inteligencji (LLM).

---

## 1. Wizja i Cel Biznesowy
**Problem:** Dzieci szybko nudzą się tradycyjnym zwiedzaniem nowych miast (zabytki, architektura), co prowadzi do frustracji rodziców i skrócenia czasu wycieczek.  
**Rozwiązanie:** Interaktywna aplikacja typu "gra paragrafowa", która na bieżąco zamienia prawdziwe otoczenie (punkty POI z map) we wciągającą opowieść dopasowaną do wieku dziecka, zachęcając je do fizycznego odkrywania kolejnych punktów na trasie.  
**Kluczowa Wartość (USP):** Kontekstowe, generowane w czasie rzeczywistym scenariusze uziemione w rzeczywistej geografii, sterowane przez rodzica za pomocą prostego komunikatora.

---

## 2. Grupa Docelowa (Segmentacja Użytkowników)
System musi dostosowywać poziom skomplikowania, słownictwo i rodzaj zadań do jednej z trzech grup wiekowych:
1. **Maluchy (3-6 lat):** Motyw "Magiczni Przyjaciele". Proste polecenia ruchowe, rozpoznawanie kolorów/kształtów w otoczeniu.
2. **Dzieci (7-11 lat):** Motyw "Łowcy Przygód". Zagadki detektywistyczne, grywalizacja, prosta dedukcja i poszukiwanie skarbów.
3. **Nastolatki (12-15 lat):** Motyw "Mroczne Tajemnice / Urban Fantasy". Miejskie legendy, intrygi, ciekawostki true-crime lub elementy Escape Roomu.

---

## 3. Stos Technologiczny (Tech Stack)
* **Orkiestrator / Silnik główny:** `n8n` (zarządzanie automatyzacjami i przepływem danych).
* **Interfejs Użytkownika (Frontend):** Niestandardowa, piękna aplikacja webowa PWA (zbudowana w React / Tailwind CSS), połączona z n8n przy pomocy Webhooków.
* **Silnik Generatywny (Mózg):** `OpenAI (GPT-4o)` lub `Anthropic (Claude 3.5 Sonnet)`.
* **Baza Danych (Pamięć Gry):** `Airtable` lub `Supabase` (przechowywanie stanu sesji i historii kroków gracza).
* **Geodane (Uziemienie AI):** `Google Places API` (pobieranie prawdziwych punktów docelowych w pobliżu).

---

## 4. Zakres Funkcjonalności (MVP - Minimum Viable Product)
1. **Rejestracja sesji:** Użytkownik wysyła komendę /start, podaje nazwę miasta oraz wybiera wiek dzieci.
2. **Inicjalizacja gry:** System zakłada nowy rekord sesji w bazie danych i generuje fabularny wstęp (opis początkowy).
3. **Pobieranie POI:** System dynamicznie pobiera 2 okoliczne, rzeczywiste miejsca turystyczne w promieniu X km.
4. **Rozgrywka Paragrafowa (Core Loop):**
   - AI otrzymuje dane o 2 rzeczywistych lokacjach.
   - AI buduje fragment opowieści i daje graczowi wybór (Opcja A prowadzi do Lokacji 1, Opcja B prowadzi do Lokacji 2).
   - Użytkownik wybiera przycisk (A lub B) w komunikatorze.
   - n8n zapisuje wybór w bazie (Historia_Krokow), uaktualnia streszczenie i powtarza proces dla nowej lokacji.
5. **Edukacja:** Zintegrowanie jednej prawdziwej ciekawostki historycznej w każdym kroku.
6. **Koniec sesji:** Zakończenie fabuły na życzenie użytkownika lub po osiągnięciu określonej liczby kroków.

---

## 5. Funkcjonalności Rozszerzone ("Nice to Have" na zaliczenie)
* **Text-to-Speech (TTS):** Integracja z API `ElevenLabs` dla generowania wypowiedzi bohaterów w formie audio.
* **Image Generation:** Integracja z `DALL-E 3` dla generowania ilustracji do lokacji i "potworów" ukrywających się przed budynkami.
* **Pogoda zależy od akcji:** Integracja z `OpenWeather API` (zmuszanie AI do poprowadzenia gracza do zadaszonych budynków/muzeów, gdy API zgłasza deszcz).

---

## 6. Architektura Danych (Szkic Bazy)
Baza typu Relational, złożona z dwóch tabel:
* **Tabela `Aktywne_Sesje`**: (Session_ID, Wiek, Miasto, Motyw, Streszczenie_Przygody, Status)
* **Tabela `Historia_Krokow`**: (Step_ID, Link do Aktywne_Sesje, Czas, Lokacja_Rzeczywista, Wybor_Gracza, Odpowiedz_AI)

---

## 7. Główne Ryzyka i Metody Mitygacji
| Ryzyko | Opis | Rozwiązanie |
| :--- | :--- | :--- |
| **Halucynacje Geograficzne** | AI wymyśli obiekt (np. magiczną wieżę), która fizycznie nie istnieje, wprowadzając w błąd użytkownika na ulicy. | Ograniczenie System Promptem. Wstrzykiwanie twardych danych z Google Places i zakaz dla AI opisywania obiektów spoza wstrzykniętego JSON-a. |
| **Koszty API** | Niekontrolowane zużycie tokenów OpenAI podczas nieskończonej gry paragrafowej. | Zarządzanie kontekstem w n8n. Przesyłanie do LLM jedynie `updated_story_summary` (krótkiego streszczenia) zamiast pełnej historii chatu. |
| **Logika Przestrzenna** | AI wyśle gracza 5 kilometrów dalej do pojedynczego kroku gry. | Narzucenie ścisłego promienia wyszukiwania (np. `radius: 500m`) w zapytaniach do Google Places. |

---

## 8. Kryteria Sukcesu Projektu
Projekt uważa się za udany, jeżeli:
1. Użytkownik jest w stanie rozpocząć grę na komunikatorze.
2. AI wygeneruje minimum 3 poprawne kroki fabularne (bez błędów parsowania JSON).
3. Opcje w grze prowadzą do **rzeczywistych** punktów na mapie.
4. Stan gry i podejmowane decyzje zostaną poprawnie zarchiwizowane w wybranej bazie danych.
