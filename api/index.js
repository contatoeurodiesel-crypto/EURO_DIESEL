import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { servicos, pecas, total } = req.body;
    const prompt = `Analise como engenheiro diesel da Euro Diesel: Serviços R$ ${servicos}, Peças R$ ${pecas}. Dê uma dica curta.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.status(200).json({ reply: text });
  } catch (error) {
    res.status(500).json({ reply: "Erro de conexão. Verifique a região na Vercel." });
  }
}

// Atualizado para Washington
