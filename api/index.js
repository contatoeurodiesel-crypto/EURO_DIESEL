import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuração da Chave
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { servicos, pecas, total } = req.body;

    const prompt = `Você é o Engenheiro Chefe da Euro Diesel Mecatrônica. 
    Analise estes números: Serviços R$ ${servicos}, Peças R$ ${pecas}, Total R$ ${total}.
    Dê um conselho técnico de ALTO NÍVEL para a oficina hoje. 
    Seja breve (máximo 3 frases) e profissional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Erro na conexão com a IA da Euro Diesel." });
  }
}
