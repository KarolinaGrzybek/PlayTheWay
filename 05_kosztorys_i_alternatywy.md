# Kosztorys i Darmowe/Open-Source Alternatywy

Projekt na zaliczenie ma to do siebie, że nie powinien generować stałych kosztów. Na szczęście, architekturę, którą zaplanowaliśmy, można zrealizować w **100% za darmo** (lub za absolutne grosze, rzędu 5-10 PLN za całe testowanie), jeśli wykorzystamy odpowiednie narzędzia i plany darmowe (Free Tiers).

Oto rozbicie kosztów i rekomendowane darmowe alternatywy.

---

## 1. Orkiestrator (n8n)
* **Wersja Płatna (Cloud):** od 20 EUR / miesiąc.
* **Wersja DARMOWA:** n8n jest projektem typu "Fair-code".
  * **Opcja A (Najprostsza):** Pobierz darmową aplikację desktopową n8n na swój komputer. Do zaliczenia (gdzie pokazujesz działający system ze swojego laptopa) jest to idealne i w 100% darmowe rozwiązanie.
  * **Opcja B (Dla odważnych):** Self-hosting na darmowym serwerze (np. darmowy VPS od Oracle Cloud lub Render.com) za pomocą Dockera.

## 2. Silnik AI (Generowanie Tekstu)
* **Opcja DARMOWA nr 1: Google Gemini (Najlepsza dla Ciebie):** 
  * Tak! W n8n możesz natywnie użyć modelu Gemini. Google udostępnia **darmowe API (w Google AI Studio)** dla modeli takich jak Gemini 1.5 Flash. 
  * Darmowy limit jest bardzo hojny (np. 15 zapytań na minutę, 1500 dziennie) - absolutnie idealnie na zaliczenie.
  * Zaletą jest świetne radzenie sobie z JSON, długi kontekst i absolutny brak kosztów na start.
* **Opcja DARMOWA nr 2: Groq (Llama 3):** 
  * Alternatywa dająca dostęp do darmowego API dla modeli Open-Source takich jak Llama 3 od Mety. Znakomita do szybkiego generowania tekstu.
* **Wersja "Premium" (OpenAI / Anthropic):** 
  * Modele GPT-4o lub Claude 3.5. Nie mają planu darmowego dla API (Pay-as-you-go). Testowanie projektu kosztowałoby ok. 1-2 USD.

## 3. Baza Danych
* **Airtable:** Posiada hojny plan darmowy (Free Tier). Pozwala na 1000 rekordów (wierszy) na bazę danych. Dla projektu na zaliczenie, gdzie będziesz testować grę na sobie i 2-3 znajomych, wygenerujecie może 100-200 rekordów. **Koszt: 0 PLN.**
* **Supabase (Alternatywa Open-Source):** Jeśli wolisz rozwiązanie Open-Source (alternatywa dla Firebase), Supabase daje darmową bazę PostgreSQL (limit 500 MB). **Koszt: 0 PLN.**

## 4. Komunikator (Frontend)
* **Telegram:** API dla Botów na Telegramie jest w 100% darmowe i bez limitów. Znacznie łatwiejsze w konfiguracji z n8n niż WhatsApp.
* **WhatsApp:** Wymaga konta Meta Developer i weryfikacji firmy, choć do testów (test numbers) jest darmowe. Zdecydowanie rekomenduję Telegram na zaliczenie. **Koszt: 0 PLN.**

## 5. Geodane (Miejsca na mapie)
* **Google Places API:** Google daje co miesiąc **200 USD darmowego kredytu** na mapy i API. Zapytanie o pobliskie miejsca to ułamki centów. Zanim zużyjesz darmowe 200 dolarów, musiałabyś przeprowadzić dziesiątki tysięcy gier. Musisz tylko podpiąć kartę w Google Cloud, by zweryfikować konto. **Koszt: 0 PLN.**
* **OpenStreetMap / Overpass API (Alternatywa Open-Source):** W 100% darmowe, bez podpinania karty, potężne api do zapytań o punkty na mapie (np. `node["historic"="monument"](around:500,lat,lon)`). Wymaga jednak trochę nauki ich specyficznego języka zapytań. 

## 6. Dodatki (Głos i Obraz)
* **ElevenLabs (Głos):** Darmowy plan to 10 000 znaków miesięcznie. Na pokaz zaliczeniowy w zupełności wystarczy, by wygenerować głos pirata do 3-4 lokacji. **Koszt: 0 PLN.**
* **Generowanie Obrazów:** OpenAI DALL-E kosztuje centy za zdjęcie, ale jeśli chcesz darmowe i Open-Source, użyj API od **Hugging Face** (darmowe do testów dla modeli takich jak Stable Diffusion).

---

## Podsumowanie i Rekomendacja (Tech-Stack na 0 PLN)

Jeśli Twoim priorytetem jest absolutny brak kosztów i otwartość narzędzi, proponuję taki zestaw:

1. **Silnik:** n8n (Aplikacja Desktopowa - uruchamiana lokalnie u Ciebie na komputerze).
2. **Frontend:** Telegram Bot API (Darmowe, bez podawania karty).
3. **Baza Danych:** Airtable (Zmieścisz się w darmowym limicie 1000 rekordów bez problemu).
4. **Mózg AI:** API Google Gemini (darmowe, potężne rozwiązanie w Google AI Studio, świetnie radzące sobie ze strukturą JSON) lub Groq API jako zapasowa darmowa opcja.
5. **Mapy:** OpenStreetMap / Overpass API (Zupełnie darmowe zapytania geograficzne) lub Google Places (korzystając z darmowych 200$).

**Realny koszt na zaliczenie:** 0,00 PLN (i świetnie brzmi, gdy na prezentacji powiesz "Projekt oparty niemal całkowicie o darmowe modele i open-source").
