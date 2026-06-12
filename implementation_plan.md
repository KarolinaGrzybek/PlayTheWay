# Migracja PlayTheWay: Airtable → Supabase

## Cel
Zastąpić Airtable bazą Supabase (PostgreSQL). Airtable pozostaje bez zmian. n8n będzie korzystać z Supabase REST API zamiast Airtable node'ów.

---

## Dlaczego Supabase?

| Problem | Airtable | Supabase |
|---|---|---|
| Błąd 422 | n8n node v2 ma bugi z updateBy:id | REST API jest proste i niezawodne |
| Pola JSON | Airtable traktuje tablice jako tekst | Postgres natywnie obsługuje JSONB |
| Zapytania | Ograniczone filtrowanie | Pełny SQL |
| Darmowy tier | 1000 rekordów | 500MB + nieograniczone wiersze |

---

## Co Ty musisz zrobić (tylko raz)

> [!IMPORTANT]
> ### Krok 1: Utwórz projekt Supabase
> 1. Wejdź na [supabase.com](https://supabase.com) → **Start your project**
> 2. Zaloguj się (GitHub/Google)
> 3. **New project** → nazwa: `playtheway`, hasło dowolne
> 4. Po ~2 minutach projekt będzie gotowy
>
> ### Krok 2: Skopiuj dane dostępowe
> W panelu Supabase: **Settings → API**
> - `Project URL` (np. `https://xxxx.supabase.co`)
> - `anon/public key` (długi token zaczynający się od `eyJ...`)
>
> ### Krok 3: Utwórz tabelę (wklej SQL)
> W panelu Supabase: **SQL Editor** → wklej i uruchom:
> ```sql
> CREATE TABLE IF NOT EXISTS game_sessions (
>   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
>   session_id TEXT UNIQUE NOT NULL,
>   city TEXT,
>   age_group TEXT,
>   current_step_index INTEGER DEFAULT 0,
>   total_steps INTEGER DEFAULT 8,
>   quest_goal TEXT,
>   story_summary TEXT,
>   inventory JSONB DEFAULT '[]',
>   available_pois JSONB DEFAULT '[]',
>   visited_pois JSONB DEFAULT '[]',
>   planned_route JSONB DEFAULT '[]',
>   created_at TIMESTAMP DEFAULT NOW(),
>   updated_at TIMESTAMP DEFAULT NOW()
> );
> ```
>
> ### Krok 4: Podaj mi te dane
> - Project URL
> - anon key

---

## Co ja zrobię automatycznie

### Węzły n8n do zastąpienia

| Stary węzeł | Nowy węzeł | Akcja |
|---|---|---|
| `Airtable: Check Session` | Code node | `GET /rest/v1/game_sessions?session_id=eq.{id}` |
| `Airtable: Create Session` | Code node | `POST /rest/v1/game_sessions` |
| `Airtable: Update Summary` | Code node | `PATCH /rest/v1/game_sessions?session_id=eq.{id}` |
| `Airtable: Log Step` | Code node | Usunięty (zbędny) |

#### [MODIFY] Airtable: Check Session → Supabase: Check Session
```js
const supabaseUrl = 'SUPABASE_URL';
const supabaseKey = 'SUPABASE_KEY';
const sessionId = $('Webhook').first().json.body.sessionId;

const resp = await this.helpers.httpRequest({
  method: 'GET',
  url: `${supabaseUrl}/rest/v1/game_sessions?session_id=eq.${sessionId}&select=*`,
  headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
});
const session = resp[0] || null;
return [{ json: { session, isNew: !session } }];
```

#### [MODIFY] Airtable: Create Session → Supabase: Create Session
```js
// Creates new row in game_sessions with session_id, city, age_group, planned POIs
```

#### [MODIFY] Airtable: Update Summary → Supabase: Update Session
```js
// PATCH by session_id (nie po ID rekordu!) - brak błędu 422
```

### Naprawy przy okazji (bez zmian w Airtable)

#### Mapa nie centruje się na mieście
- `RouteMapView.tsx`: Gdy brak `currentPOI.lat/lon`, mapą centruje się przez geokodowanie nazwy miasta (Nominatim API)
- Dodanie markerów dla `visitedPOIs` i `availablePOIs`

#### Krok 0/8 (currentStepIndex)
- `Merge Response` node będzie poprawnie używał `currentStepIndex` z Parse AI Response (+1 względem poprzedniego)

#### Klucze do finału (inventory)
- `inventory` będzie tablicą JSONB w Supabase — nie stringiem — więc parsowanie będzie bezawaryjne

---

## Open Questions

> [!IMPORTANT]
> **Czy chcesz zachować dane z aktywnych sesji Airtable?**
> Jeśli tak, mogę napisać skrypt migracyjny który skopiuje dane z Airtable do Supabase.
> Jeśli nie (gracze zaczną od nowa), pomijamy migrację.

> [!NOTE]
> **Czy Supabase może być hostowany lokalnie?**
> Supabase ma darmowy cloud tier który wystarczy. Jeśli wolisz self-hosted, możemy też uruchomić Supabase w Dockerze obok n8n.

---

## Weryfikacja

Po migracji:
1. Nowa sesja → rekord w Supabase → widoczny w Supabase Table Editor
2. Kliknięcie wyboru → `current_step_index` rośnie o 1 w bazie
3. Inventory → tablica JSON wypełnia się po każdym kroku
4. Mapa centruje się na mieście, marker na `currentPOI`
