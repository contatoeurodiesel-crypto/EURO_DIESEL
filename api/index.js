import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  
  // NOME PADRÃO SEM O "LATEST" - Versão estável
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { servicos, pecas } = req.body;
    
    const prompt = `Engenheiro Mecatrônico Euro Diesel: Analise faturamento de Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica de 2 frases sobre Scania, Volvo ou sistemas Common Rail.`;

    const result = await model.generateContent(prompt);
    
    // Pegando a resposta de forma segura
    const text = result.response.candidates[0].content.parts[0].text;

    res.status(200).json({ reply: text });
  } catch (error) {
    res.status(500).json({ reply: "ERRO DE MODELO: " + error.message });
  }
}
