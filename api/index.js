import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Inicializa a IA
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

  try {
    // Forçamos o modelo estável e preparamos os dados
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { servicos, pecas } = req.body;

    const prompt = `Analise como engenheiro mecatrônico da Euro Diesel: Serviços R$ ${servicos}, Peças R$ ${pecas}. Dê uma dica técnica curta e profissional.`;

    // Gerando o conteúdo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    // Log detalhado para o Dashboard da Vercel
    console.error("ERRO GOOGLE API:", error);
    res.status(500).json({ reply: "ERRO DE MOTOR: " + error.message });
  }
}
