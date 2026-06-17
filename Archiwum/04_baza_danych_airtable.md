# Architektura Bazy Danych (Airtable)

W n8n nasza aplikacja działa "bezstanowo" – to znaczy, że po każdym kroku zapomina wszystko, co się wydarzyło. Baza danych w Airtable działa jako pamięć krótkotrwała (stan sesji) oraz pamięć długotrwała (historia kroków). 

Aby to działało, potrzebujemy **dwóch tabel** połączonych ze sobą relacją. Poniżej znajduje się precyzyjna instrukcja, jak skonfigurować kolumny i ich typy w Airtable.

---

## Tabela 1: `Aktywne_Sesje` (Active Sessions)
Ta tabela zarządza aktualnym stanem gracza. Aktualizujemy ją w n8n po każdym wykonanym kroku.

| Nazwa Kolumny | Typ w Airtable | Opis / Cel |
| :--- | :--- | :--- |
| **Session_ID** *(Klucz Główny)* | `Single line text` | Unikalny identyfikator użytkownika. Najlepiej numer telefonu z Telegrama lub Chat ID. Po tym n8n szuka, z kim rozmawia. |
| **Age_Group** | `Single select` | Wiek dzieci. Opcje: `3-6`, `7-11`, `12-15`. Zmienna wstrzykiwana do promptu n8n, by wybrać odpowiedni pod-prompt. |
| **City** | `Single line text` | Miasto wpisane przez użytkownika na początku gry (np. "Kraków"). |
| **Current_Theme** | `Single select` | Obecny motyw np. `Magiczni Przyjaciele`, `Łowcy Przygód`, `Mroczne Tajemnice`. |
| **Story_Summary** | `Long text` | **Kluczowa kolumna.** Krótkie podsumowanie tego, co wydarzyło się do tej pory. Nadpisywane przez AI przy każdym kroku, aby zachować kontekst bez wysyłania tysięcy tokenów. |
| **Status** | `Single select` | Status gry. Opcje: `Oczekuje`, `W trakcie gry`, `Zakończona`. |
| **Last_Update** | `Last modified time` | Automatyczne pole Airtable. Pokazuje, kiedy ostatnio gracz dokonał wyboru. Pomaga w czyszczeniu starych sesji. |

---

## Tabela 2: `Historia_Krokow` (Step History)
Ta tabela zapisuje logikę "paragrafów". Każdy rekord to pojedyncza decyzja, którą podjął użytkownik na ulicy. 

Dzięki tej tabeli wiemy, gdzie użytkownik był (żeby nie wysłać go drugi raz w to samo miejsce) i na co zagłosował.

| Nazwa Kolumny | Typ w Airtable | Opis / Cel |
| :--- | :--- | :--- |
| **Step_ID** *(Klucz Główny)* | `Autonumber` | Airtable automatycznie nadaje numer po kolei (1, 2, 3...). |
| **Session_ID (Link)** | `Link to another record` | **Relacja!** Musisz połączyć to pole z tabelą `Aktywne_Sesje`. Dzięki temu klikając w jedną sesję, widzisz całą listę kroków danej rodziny. |
| **Real_Location_Name** | `Single line text` | Rzeczywista nazwa miejsca pobrana z Google Places API (np. "Pomnik Smoka Wawelskiego"). |
| **User_Choice** | `Single line text` | Co fizycznie kliknął gracz na ekranie w poprzednim kroku (np. "Idziemy w prawo"). |
| **AI_Response** | `Long text` | Pełen wygenerowany przez LLM akapit (np. "Smok ożywa i ryczy..."). Przydaje się do debugowania halucynacji. |
| **Created_At** | `Created time` | Automatyczne pole Airtable, zapisujące czas dodania logu. |

---

## Jak zaimplementować to w n8n (Podsumowanie)
1. Gdy przychodzi nowa wiadomość od gracza, n8n używa węzła **Airtable (Search/Get)** na tabeli `Aktywne_Sesje` szukając `Session_ID`.
2. Z rekordu pobiera pola `Age_Group` oraz `Story_Summary` i pakuje do LLM.
3. Gdy AI wymyśli nowy etap, n8n dodaje nowy wiersz do `Historia_Krokow` węzłem **Airtable (Create)**.
4. Na koniec, n8n bierze tabelę `Aktywne_Sesje` i węzłem **Airtable (Update)** nadpisuje w niej pole `Story_Summary` na nowe, dostarczone przez AI.
