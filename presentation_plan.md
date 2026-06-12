# PlayTheWay - Plan Prezentacji (Projekt Zaliczeniowy)

Poniższa struktura została dostosowana do specyfiki obrony projektu na studiach. Nacisk przeniesiono ze "sprzedaży wizji" na pokazanie **rozwiązania inżynierskiego, logiki biznesowej oraz zaawansowanego wykorzystania Sztucznej Inteligencji**.

> [!IMPORTANT]
> **Cel główny prezentacji**
> Pokazać prowadzącym, że projekt to nie tylko ładny interfejs, ale skomplikowany ekosystem, w którym AI jest "okiełznane" i działa według ścisłych reguł, współpracując z bazą danych i zewnętrznymi API.

---

## 1. Wstęp i Założenia Projektu (Kontekst)
**Slajd 1: Strona tytułowa**
* **Grafika:** Logo PlayTheWay, imię i nazwisko autorki.
* **Treść:** Aplikacja zamieniająca miejskie spacery w interaktywne gry fabularne (RPG) dzięki wykorzystaniu LLM i geolokalizacji.

**Slajd 2: Problem i Rozwiązanie**
* **Problem:** Brak angażujących narzędzi zachęcających dzieci i młodzież do eksploracji miast. Tradycyjne przewodniki są bierne i powtarzalne.
* **Rozwiązanie (PlayTheWay):** Dynamiczne, nieskończone generowanie scenariuszy w oparciu o prawdziwe dane mapowe (OpenStreetMap) i adaptacyjną Sztuczną Inteligencję wcielającą się w Mistrza Gry.

## 2. Architektura Systemu
**Slajd 3: Tech Stack (Ekosystem)**
* **Wizualizacja:** Uproszczony diagram architektury (Frontend -> Backend/n8n -> Supabase + Gemini + Nominatim/Overpass).
* **Treść:** Omówienie ról poszczególnych komponentów.
  * **React:** Responsywny interfejs użytkownika i stan aplikacji.
  * **Supabase:** Nierelacyjna/Relacyjna baza przechowująca stan sesji gry (ekwipunek, postępy).
  * **n8n:** Orkiestrator logiki (szyna danych łącząca AI z resztą świata).

**Slajd 4: Integracja danych zewnętrznych (Geodata)**
* **Treść:** Skąd AI wie, gdzie jesteśmy?
* **Narracja:** Zamiast wpisywać miejsca ręcznie, system dynamicznie pobiera współrzędne miasta przez **Nominatim**, a następnie szuka w promieniu X km zabytków, parków i atrakcji używając zapytań do **Overpass API**. Wyniki są filtrowane i sortowane algorytmem Haversine'a.

## 3. Sztuczna Inteligencja w Praktyce (Główny Punkt Programu)
*Tutaj skupiamy się na prompt engineeringu i okiełznaniu modeli językowych.*

**Slajd 5: Rola AI w systemie (Dynamiczny Mistrz Gry)**
* **Treść:** LLM (Google Gemini) nie jest tu prostym chatbotem. Działa jako "silnik decyzyjny" i generator narracji w zamkniętej pętli.
* **Narracja:** AI otrzymuje od orkiestratora precyzyjny kontekst (wiek dziecka, obecna lokacja, ekwipunek) i na tej podstawie musi wygenerować zagadkę oraz opcje na kolejny krok.

**Slajd 6: Prompt Engineering i Guardrails (Ochrona przed Halucynacjami)**
* **Treść:** Zrzut ekranu fragmentu naszego skomplikowanego promptu (tagi `<critical_rules>`, `<dynamic_context>`).
* **Narracja:** Wyzwania przy pracy z LLM. Jak zablokowaliśmy generowanie zagadek matematycznych, zadań z literami oraz zmyślanie lokacji? Wymuszenie ról dopasowanych do wieku i surowe zasady bezpieczeństwa (tzw. guardrails).

**Slajd 7: Wymuszanie Struktury Danych (Structured Output)**
* **Treść:** Schemat JSON, który model musi zwrócić.
* **Narracja:** AI nie może zwracać po prostu tekstu. Skonfigurowaliśmy węzeł LangChain z `jsonOutput: true`, wymuszając zwracanie czystego JSON-a, który następnie jest walidowany i parsowany (skrypt naprawczy JavaScript w n8n). To pozwala na aktualizację bazy w Supabase (np. dodanie przedmiotu do ekwipunku) na podstawie decyzji AI.

## 4. Prezentacja Działania i Wnioski
**Slajd 8: Krótkie Demo / Flow Gracza**
* **Treść:** Pokazanie 2-3 zrzutów ekranu z aplikacji (Ekran startowy -> Zagadka o "Tajemniczej Kamienicy" -> Ekran sukcesu z wyborem kolejnej drogi).

**Slajd 9: Wyzwania i Wnioski z realizacji**
* **Treść:** Co było najtrudniejsze technicznie?
* **Narracja:** Wspomnienie o trudnościach w parsowaniu nieprzewidywalnych odpowiedzi od LLM (np. kiedy zwraca dane schowane w obiekcie `parts[0].text`), optymalizacja czasów odpowiedzi, zarządzanie stanem w Supabase przy równoległych żądaniach.

**Slajd 10: Podsumowanie**
* Pytania od komisji / prowadzącego.
