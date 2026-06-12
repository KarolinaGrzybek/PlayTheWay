# Poradnik: Jak skonfigurować bazę w Airtable krok po kroku

Airtable wygląda i działa bardzo podobnie do Excela lub Google Sheets, ale pod maską jest pełnoprawną, relacyjną bazą danych. Wyklikanie naszej struktury zajmie Ci dosłownie 5 minut. 

Oto instrukcja krok po kroku.

---

## Krok 1: Rejestracja i nowa "Baza" (Base)
1. Wejdź na stronę [airtable.com](https://airtable.com/) i załóż darmowe konto.
2. Po zalogowaniu trafisz do swojego "Workspace" (Przestrzeni roboczej).
3. Kliknij duży przycisk **"Create a base"** (Zbuduj bazę). 
4. Zostaniesz zapytana o kolor i nazwę. Nazwij ją np. `Gra Turystyczna AI`. Airtable od razu stworzy dla Ciebie pierwszą, pustą tabelę o nazwie `Table 1`.

---

## Krok 2: Tworzenie Tabeli `Aktywne_Sesje`
1. W lewym górnym rogu ekranu zmień nazwę `Table 1` na **`Aktywne_Sesje`**.
2. Airtable domyślnie dodaje kolumny takie jak "Name", "Notes", "Status". Zignoruj je lub usuń klikając na ich nagłówek -> *Delete field*.
3. Kliknij przycisk **"+"** (Add field), który znajduje się po prawej stronie ostatniej kolumny, aby dodać nowe pole:
   * **Nazwa:** `Session_ID`. **Typ:** Wyszukaj i wybierz `Single line text`. *To najważniejsze pole (tzw. Primary Field, pierwsza kolumna z lewej). Jeśli tam jest już jakieś pole, po prostu zmień jego nazwę na Session_ID i typ na Single line text.*
   * **Dodaj pole:** Nazwa `Age_Group`. **Typ:** `Single select`. Pojawi się okienko dodawania opcji – wpisz `3-6`, naciśnij Enter, wpisz `7-11`, naciśnij Enter, i `12-15`, naciśnij Enter.
   * **Dodaj pole:** Nazwa `City`. **Typ:** `Single line text`.
   * **Dodaj pole:** Nazwa `Current_Theme`. **Typ:** `Single select`. Dodaj opcje: `Magiczni Przyjaciele`, `Łowcy Przygód`, `Mroczne Tajemnice`.
   * **Dodaj pole:** Nazwa `Story_Summary`. **Typ:** `Long text`.
   * **Dodaj pole:** Nazwa `Status`. **Typ:** `Single select`. Opcje: `Oczekuje`, `W trakcie gry`, `Zakończona`.
   * **Dodaj pole:** Nazwa `Last_Update`. **Typ:** `Last modified time`. Zostaw domyślne opcje formatowania czasu.

---

## Krok 3: Tworzenie Tabeli `Historia_Krokow`
1. Obok zakładki `Aktywne_Sesje` u góry po lewej stronie, znajdziesz ikonkę **"+" (Add or import)**. Kliknij ją i wybierz **"Create empty table"**.
2. Zmień nazwę tej nowej tabeli na **`Historia_Krokow`**.
3. Ponownie, usuń niepotrzebne domyślne kolumny i zacznij dodawać nasze:
   * **Pierwsza kolumna (Primary field):** Zmień jej nazwę na `Step_ID`, a typ z tekstu na **`Autonumber`**. Dzięki temu Airtable sam ponumeruje każdy wpis.

### ⚠️ Krok 4: Magia relacji (Łączenie tabel)
Tutaj łączymy kroki z konkretną sesją gracza.
1. Będąc w tabeli `Historia_Krokow`, kliknij **"+"** aby dodać nową kolumnę.
2. Nazwij ją `Session_ID (Link)`.
3. W typie pola (Field type) wyszukaj i wybierz **`Link to another record`**.
4. Airtable zapyta: *"Do której tabeli chcesz to podłączyć?"*. Wybierz z listy tabelę **`Aktywne_Sesje`**.
5. *Pojawi się suwak "Allow linking to multiple records" (Zezwalaj na łączenie z wieloma rekordami) – możesz go WYŁĄCZYĆ (jeden krok należy tylko do jednej sesji).*
6. *Pojawi się też pytanie, czy chcesz dodać pola "Lookup" – kliknij "Skip" (Pomiń).*

### Krok 5: Dokończenie tabeli `Historia_Krokow`
Teraz dodaj resztę zwykłych kolumn:
* **Dodaj pole:** Nazwa `Real_Location_Name`. **Typ:** `Single line text`.
* **Dodaj pole:** Nazwa `User_Choice`. **Typ:** `Single line text`.
* **Dodaj pole:** Nazwa `AI_Response`. **Typ:** `Long text`.
* **Dodaj pole:** Nazwa `Created_At`. **Typ:** `Created time`.

---

## Krok 6: Jak wyciągnąć klucze API dla n8n?
Aby n8n mogło czytać i pisać do Twojego Airtable, musisz wygenerować mu klucz (hasło).
1. W prawym górnym rogu kliknij na ikonę swojego profilu (Account) -> **Developer Hub**.
2. W zakładce "Personal access tokens" kliknij przycisk **"Create new token"**.
3. Nazwij go np. `n8n Integration`.
4. W sekcji **Scopes** (Uprawnienia) dodaj: `data.records:read` oraz `data.records:write`.
5. W sekcji **Access** (Dostęp) wybierz swoją bazę `Gra Turystyczna AI`.
6. Kliknij **Create Token**. Zobaczysz długi ciąg znaków (zaczynający się od `pat...`). **Skopiuj go**, bo zobaczysz go tylko raz! To jest Twoje hasło, które podasz później w n8n.

To wszystko! Twoja baza jest gotowa przyjmować dane z n8n.
