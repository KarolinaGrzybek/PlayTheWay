# Architektura Głównego Procesu (n8n Workflow)

Ten dokument opisuje krok po kroku, jak będzie wyglądał główny przepływ danych (Core Loop) w platformie n8n dla naszej Rodzinnej Aplikacji Turystycznej. 

Zamiast budować jeden gigantyczny przepływ, dobrą praktyką jest podział logiki. Nasz główny proces będzie działał jak pętla zagnieżdżona (Game Engine).

---

## 1. Trigger (Wyzwalacz)
Wszystko zaczyna się w momencie, gdy nasza dedykowana aplikacja webowa wyśle zapytanie (np. po kliknięciu przycisku).
*   **Węzeł:** `Webhook` (metoda POST)
*   **Dane wejściowe:** ID sesji, dokonany wybór, oraz ew. współrzędne GPS urządzenia.

---

## 2. Router Stanu Sesji (Pamięć)
n8n nie ma wbudowanej pamięci długotrwałej, dlatego pierwszy krok to odpytanie bazy danych.
*   **Węzeł:** `Airtable` (Operacja: *Search/Get*)
*   **Logika:** "Poszukaj rekordu w tabeli `Aktywne_Sesje`, gdzie Session_ID równa się Chat ID z Webhooka."

**Węzeł Switch / IF:**
*   **Ścieżka A (Brak rekordu):** Uruchom **Onboarding Workflow** (Pytanie o miasto, wiek dzieci, utworzenie nowego rekordu w bazie).
*   **Ścieżka B (Rekord istnieje):** Kontynuuj **Główną Pętlę Gry** (przejdź do kroku 3).

---

## 3. Logika Przestrzenna (Uziemienie / Grounding)
Musimy dać AI kontekst geograficzny, aby uniknąć halucynacji.
*   **Węzeł 1:** `HTTP Request` (Google Places API)
    *   **Cel:** Pobranie listy miejsc turystycznych w promieniu np. 500m od aktualnej lokalizacji z bazy, wykluczając miejsca już odwiedzone (sprawdzenie tabeli `Historia_Krokow`).
*   **Węzeł 2:** `Code Node` (JavaScript)
    *   **Cel:** Oczyszczenie brudnych danych z API. Wyciągamy tylko nazwy dwóch losowych miejsc, ich opisy i adresy, i formatujemy to do prostego tekstu/JSON-a dla AI.

---

## 4. Silnik AI (Generowanie Opowieści)
Tutaj dzieje się magia gry paragrafowej.
*   **Węzeł:** `OpenAI` / `Anthropic` (Message / Chat node)
*   **Wejście do Promptu (Zmienne wstrzykiwane przez n8n):**
    *   `{{$json.Age_Group}}` (z kroku 2 - definiuje wstrzyknięcie odpowiedniego sub-promptu z naszego pliku *02_prompty*)
    *   `{{$json.Story_Summary}}` (z kroku 2 - kontekst)
    *   `{{$json.User_Choice}}` (z kroku 1 - to co kliknął gracz)
    *   `{{$json.POI_Data}}` (z kroku 3 - twarde dane z mapy)
*   **Wymuszenie:** Użycie funkcji narzędziowych modelu (Tool Calling / Structured Output) w celu wymuszenia zwrotu sztywnego obiektu JSON (Narracja + Przyciski + Nowe podsumowanie).

---

## 5. Zapis Stanu (Zarządzanie Pamięcią)
Zanim wyślemy odpowiedź do użytkownika, musimy zaktualizować bazę.
*   **Węzeł 1:** `Airtable` (Operacja: *Update*)
    *   **Cel:** Aktualizacja pola `Story_Summary` w tabeli `Aktywne_Sesje` na nowe podsumowanie wygenerowane przez AI.
*   **Węzeł 2:** `Airtable` (Operacja: *Create*)
    *   **Cel:** Utworzenie nowego rekordu w tabeli `Historia_Krokow` z informacją o tym, jaka narracja padła i jakie były opcje.

---

## 6. Odpowiedź do Użytkownika (Frontend)
Zamykamy pętlę, wysyłając JSON-a z powrotem do naszej aplikacji frontendowej.
*   **Węzeł:** `Webhook Response`
*   **Mapowanie:** 
    *   Odsyłamy czysty kod JSON wygenerowany przez AI (narrative_text, choices) z powrotem do klienta, a aplikacja w React zajmie się płynnym i ładnym wyświetleniem tych danych na ekranie.

---

## Podsumowanie Wizualne (Flowchart)

[Aplikacja Webowa: Webhook Request] 
      ⬇
[Baza: Czy sesja istnieje?] 
  ├── NIE ➔ [Flow: Onboarding i Setup]
  └── TAK ➔ [API: Google Places (Pobierz 2 lokacje)]
                 ⬇
            [AI Node: Generuj fabułę i opcje JSON]
                 ⬇
            [Baza: Zapisz krok i aktualizuj summary]
                 ⬇
            [Webhook Response: Zwróć dane JSON]
                 ⬇
            *(Aplikacja renderuje piękny widok na telefonie)*
