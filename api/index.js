import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Inicializa a IA com a sua chave
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  
  // AJUSTE AQUI: Usando o modelo com a nomenclatura completa e estável
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { servicos, pecas } = req.body;
    
    // Criando o prompt técnico para a Euro Diesel
    const prompt = `Engenheiro Mecatrônico Euro Diesel: Analise Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica curta e profissional sobre sistemas Scania, Volvo ou Common Rail.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    // Se ainda der erro, ele nos dirá o que é
    res.status(500).json({ reply: "ERRO NA IA: " + error.message });
  }
}
