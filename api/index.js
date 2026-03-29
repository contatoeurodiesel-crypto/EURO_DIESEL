import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: "Método não permitido" });

  const { servicos, pecas } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

  try {
    // O SDK oficial gerencia a versão (v1/v1beta) sozinho
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Atue como Engenheiro Master da Euro Diesel. 
    Analise estes dados: Serviços R$ ${servicos} e Peças R$ ${pecas}. 
    Dê uma dica técnica curta (máximo 2 linhas) para mecânicos de Scania ou Volvo. 
    Responda de forma profissional e tecnológica.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erro na IA:", error);
    res.status(500).json({ reply: "ERRO TÉCNICO: " + error.message });
  }
}
