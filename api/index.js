import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { servicos, pecas } = req.body;
    const prompt = `Como engenheiro diesel, analise: Serviços R$ ${servicos}, Peças R$ ${pecas}. Dê uma dica curta.`;

    const result = await model.generateContent(prompt);
    res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    // MUDAMOS AQUI: Agora ele vai te dizer no site qual é o erro real!
    res.status(500).json({ reply: "ERRO REAL: " + error.message });
  }
}
