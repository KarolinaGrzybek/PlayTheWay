const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export type POI = {
  name: string;
  lat: number;
  lon: number;
  category?: string;
  description?: string;
  wikipedia?: string;
  priority?: number;
};

export type AdventureRequest = {
  sessionId: string;
  city?: string;
  ageGroup?: string;
  userChoice?: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
  children?: string;
};

export type AdventureResponse = {
  narrative_text: string;
  updated_story_summary?: string;
  choices: {
    button_text: string;
    target_location: string;
    action_description: string;
  }[];
  currentStepIndex?: number;
  totalSteps?: number;
  currentPOI?: POI;
  plannedRoute?: POI[];
  city?: string;
  totalDistanceKm?: number;
  questGoal?: string;
  inventory?: string[];
  availablePOIs?: POI[];
  visitedPOIs?: POI[];
  item_found?: string;
  quiz?: {
    question: string;
    options: string[];
    correct_index: number;
  };
};

export type N8NResponse = {
  text: string;
  plannedRoute: POI[];
  currentStepIndex: number;
  totalSteps: number;
  choices: any[];
  questGoal?: string;
  inventory?: string[];
  currentPOI?: POI;
  quiz?: {
    question: string;
    options: string[];
    correct_index: number;
  };
};

function getSessionId() {
  let sessionId = localStorage.getItem('playtheway_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('playtheway_session_id', sessionId);
  }
  return sessionId;
}

export async function startNewMission(city: string, ageGroup: string): Promise<N8NResponse> {
  const sessionId = getSessionId();
  const data = { sessionId, city, ageGroup };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Błąd serwera: ${response.status}`);
    }

    const result = await response.json();
    console.log("N8N Response Raw:", result);

    const finalResult = Array.isArray(result) ? result[0] : result;

    // Obsługujemy WSZYSTKIE warianty nazw pól, jakie do tej pory wymyśliło Gemini (text, opis, description, story...)
    const narrativeText = finalResult.text || finalResult.narrative_text || finalResult.opis || finalResult.description || finalResult.story || "";
    const displayPlace = finalResult.miejsce ? `📍 ${finalResult.miejsce}\n\n` : "";
    const riddleText = (finalResult.zagadka || finalResult.riddle) ? `\n\n❓ ZAGADKA: ${finalResult.zagadka || finalResult.riddle}` : "";
    const nextStep = finalResult.next_step_prompt ? `\n\n💡 ${finalResult.next_step_prompt}` : "";
    
    const combinedText = displayPlace + narrativeText + riddleText + nextStep;

    if (finalResult && (combinedText.trim() !== "" || (finalResult.plannedRoute && finalResult.plannedRoute.length > 0) || finalResult.currentPOI)) {
      return {
        text: combinedText,
        plannedRoute: finalResult.plannedRoute || [],
        currentStepIndex: finalResult.currentStepIndex || 0,
        totalSteps: finalResult.totalSteps || 0,
        choices: finalResult.choices || [],
        questGoal: finalResult.questGoal || "",
        inventory: finalResult.inventory || [],
        currentPOI: finalResult.currentPOI,
        quiz: finalResult.quiz
      };
    }

    throw new Error("Serwer n8n nie zwrócił treści przygody. Sprawdź węzeł Gemini.");
  } catch (error) {
    console.error("Błąd API:", error);
    throw error;
  }
}

export async function callAdventureWebhook(data: AdventureRequest): Promise<AdventureResponse> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Blad serwera: ${response.status} ${errText}`);
    }
    
    const textResponse = await response.text();
    if (!textResponse || textResponse.trim() === '') {
       throw new Error(`Serwer n8n nie zwrocil zadnych danych (pusta odpowiedz). Upewnij sie, ze wezel "Respond to Webhook" wykonal sie poprawnie.`);
    }

    try {
      const parsed = JSON.parse(textResponse);
      const finalResult = Array.isArray(parsed) ? parsed[0] : parsed;
      
      console.log('Odpowiedz z n8n:', JSON.stringify(finalResult, null, 2));

      // Mapujemy pola AI na format zrozumiały dla Reacta (narrative_text)
      const narrativeText = finalResult.text || finalResult.narrative_text || finalResult.opis || finalResult.description || finalResult.story || "";
      const displayPlace = finalResult.miejsce ? `📍 ${finalResult.miejsce}\n\n` : "";
      const riddleText = (finalResult.zagadka || finalResult.riddle) ? `\n\n❓ ZAGADKA: ${finalResult.zagadka || finalResult.riddle}` : "";
      const nextStep = finalResult.next_step_prompt ? `\n\n💡 ${finalResult.next_step_prompt}` : "";

      // Mapujemy wybory (obsługujemy zarówno obiekty, jak i same napisy/stringi)
      let finalChoices = finalResult.choices || [];
      if (Array.isArray(finalChoices)) {
        finalChoices = finalChoices.map((choice: any) => {
          if (typeof choice === 'string') {
            return {
              button_text: choice,
              action_description: `Wybieram: ${choice}`,
              target_location: ""
            };
          }
          return choice;
        });
      }

      return {
        ...finalResult,
        narrative_text: displayPlace + narrativeText + riddleText + nextStep,
        plannedRoute: finalResult.plannedRoute || [],
        choices: finalChoices,
        questGoal: finalResult.questGoal || "",
        inventory: finalResult.inventory || [],
        availablePOIs: finalResult.availablePOIs || [],
        visitedPOIs: finalResult.visitedPOIs || [],
        quiz: finalResult.quiz
      };
    } catch (parseError) {
      console.error("Otrzymano nieprawidlowy JSON:", textResponse);
      throw new Error(`Serwer n8n zwrocil nieprawidlowy format danych (nie-JSON). Treść: ${textResponse.substring(0, 100)}...`);
    }

  } catch (error) {
    console.error('Blad komunikacji z n8n:', error);
    throw error;
  }
}