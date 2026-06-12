# Krok do przodu: Klucz API Google Gemini

Ponieważ aplikację frontendową zakodujemy samodzielnie, nie potrzebujemy już Telegrama. Jedynym zewnętrznym serwisem (poza Airtable) będzie darmowe API od Google Gemini, które posłuży jako mózg generujący nasze opowiadania.

Zrobienie tego zajmie Ci maksymalnie 5 minut.

---

## 2. Jak zdobyć darmowy klucz do Google Gemini?
Google udostępnia darmowy dostęp do swoich modeli, co jest idealne na nasz projekt zaliczeniowy.

1. Wejdź na stronę **[Google AI Studio](https://aistudio.google.com/)**.
2. Zaloguj się swoim kontem Google (Gmail).
3. Po lewej stronie ekranu kliknij w zakładkę **"Get API key"** (Pobierz klucz API).
4. Kliknij duży niebieski przycisk **"Create API key"**.
5. Google poprosi o wybór projektu w Google Cloud (jeśli nie masz żadnego, pozwól mu utworzyć nowy projekt automatycznie klikając "Create API key in a new project").
6. Zobaczysz okienko z wygenerowanym kluczem zaczynającym się od `AIzaSy...`. 
7. **Skopiuj ten klucz!** To jest przepustka dla Twojego n8n do mózgu sztucznej inteligencji.

---

## Podsumowanie - Co masz w ręku?
Zanim włączymy n8n, powinnaś mieć zapisane w notatniku (lub w pamięci podręcznej komputera) trzy bardzo ważne ciągi znaków:
1. **Personal Access Token z Airtable** (zaczynający się od `pat...`)
2. **Token Bota z Telegrama** (ciąg znaków połączony dwukropkiem np. `1234:ABC...`)
3. **Klucz API Google Gemini** (zaczynający się od `AIzaSy...`)

Mając ten komplet, w n8n będziemy już tylko układać klocki i łączyć kabelki, nie martwiąc się o konfigurację!
