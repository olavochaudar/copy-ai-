
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for different marketing personas (Translated to PT-BR)
const PERSONAS = {
  general: "Você é a ViralCopy AI, um estrategista de marketing e copywriter de classe mundial. Seu tom é persuasivo, direto e focado em alta conversão. Você usa frameworks como AIDA, PAS e FAB. Não use enrolação (fluff). Vá direto ao valor. Responda sempre em Português do Brasil.",
  cro: "Você é um especialista em Otimização de Taxa de Conversão (CRO). Seu objetivo é puramente aumentar as taxas de clique e vendas. Você entende de psicologia comportamental, vieses cognitivos e experiência do usuário. Responda sempre em Português do Brasil.",
  seo: "Você é um Especialista Sênior em SEO. Você foca na intenção de busca, palavras-chave semânticas e autoridade tópica. Você escreve para humanos primeiro, mas adere estritamente às diretrizes EEAT do Google. Responda sempre em Português do Brasil.",
  sales: "Você é um Closer de Vendas High-Ticket. Você escreve roteiros que superam objeções e constroem confiança massiva. Sua linguagem é confiante e autoritária. Responda sempre em Português do Brasil.",
  email: "Você é um profissional de Marketing de Resposta Direta por E-mail. Você se especializa em taxas de abertura (assuntos) e taxas de clique (corpo do texto). Você escreve como um humano, não como uma corporação. Responda sempre em Português do Brasil."
};

export interface AIResponse {
  text: string;
  error?: string;
}

export const aiService = {
  /**
   * Generates marketing copy based on the specific tool selected
   */
  generateCopy: async (toolId: string, userInput: string): Promise<AIResponse> => {
    try {
      let systemInstruction = PERSONAS.general;
      let prompt = userInput;
      let model = 'gemini-2.5-flash';
      let config: any = {
        temperature: 0.7,
      };

      // Select the correct persona, model and prompt structure based on Tool ID
      switch (toolId) {
        case 'magic-box': // Magic Box (Complex/General)
          // Use Gemini 3 Pro with High Thinking Budget for deep reasoning
          model = 'gemini-3-pro-preview';
          config = {
            thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep analysis
          };
          systemInstruction = PERSONAS.general;
          prompt = `Atue como um estrategista sênior. 
          
          Pedido do Usuário: "${userInput}"
          
          Analise o pedido profundamente e forneça uma resposta estratégica, criativa e pronta para uso.`;
          break;

        case '1': // A/B Test Generator (Fast)
          model = 'gemini-2.5-flash-lite'; // Use Lite for speed
          systemInstruction = PERSONAS.cro;
          prompt = `Gere 5 variações de headlines (títulos) para o seguinte produto/oferta. 
          Para cada variação, explique o ângulo psicológico usado (ex: Urgência, Curiosidade, Prova Social).
          
          Produto/Contexto: ${userInput}
          
          Formato de saída:
          1. [Headline] - [Explicação do Ângulo]
          ...`;
          break;
        
        case '2': // SEO Intent Mapping
          systemInstruction = PERSONAS.seo;
          prompt = `Analise a intenção de busca para o seguinte tópico. Liste 5 palavras-chave de cauda longa específicas que os usuários podem pesquisar *antes* de comprar e, para cada uma, escreva um snippet de resposta de 50 palavras que classificaria para a 'Posição Zero'.
          
          Tópico: ${userInput}`;
          break;

        case '3': // Objection Mining
          systemInstruction = PERSONAS.sales;
          prompt = `Liste as 5 principais objeções que um comprador cético poderia ter em relação a esta oferta. Para cada objeção, escreva uma "reformulação" ou contra-argumento que dissolva a preocupação.
          
          Oferta: ${userInput}`;
          break;

        case '4': // Chatbot Script (Fast)
          model = 'gemini-2.5-flash-lite'; // Use Lite for speed
          systemInstruction = PERSONAS.sales;
          prompt = `Escreva um fluxo de conversa de chatbot de 5 etapas para um novo visitante que chega a este site. O objetivo é qualificar o lead e agendar uma demonstração. Mantenha as mensagens curtas (menos de 20 palavras cada).
          
          Contexto: ${userInput}`;
          break;

        case '5': // Rescue Email
          systemInstruction = PERSONAS.email;
          prompt = `Escreva uma sequência de 3 e-mails para abandono de carrinho. 
          E-mail 1: Lembrete útil (1 hora depois).
          E-mail 2: Prova social/Quebra de objeção (24 horas depois).
          E-mail 3: Escassez/Desconto de última chance (48 horas depois).
          
          Produto: ${userInput}`;
          break;
          
        case '6': // Avatar (ICP) (Complex)
          model = 'gemini-3-pro-preview';
          config = {
            thinkingConfig: { thinkingBudget: 16000 }, // Significant thinking budget
          };
          systemInstruction = PERSONAS.general;
          prompt = `Crie um Perfil de Cliente Ideal (Avatar/ICP) detalhado para este negócio. 
          Pense profundamente sobre a psicologia do consumidor.
          Inclua: Dados Demográficos, Psicográficos, medos mais profundos e desejos secretos.
          
          Negócio: ${userInput}`;
          break;
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          ...config
        },
      });

      return { text: response.text || "Nenhum conteúdo gerado." };
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      return { text: "", error: error.message || "Falha ao gerar copy." };
    }
  },

  /**
   * Generates copy for specific templates (reusing logic for now)
   */
  generateTemplateCopy: async (templateId: number, userInput: string): Promise<AIResponse> => {
     // Default to standard model for templates, or upgrade based on specific templates later
     try {
         const prompt = `Complete o seguinte pedido baseado em um template estratégico:
         ${userInput}`;
         
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                systemInstruction: PERSONAS.general
            }
         });
         return { text: response.text || "Erro na geração." };
     } catch(e: any) {
         return { text: "", error: e.message };
     }
  }
};
