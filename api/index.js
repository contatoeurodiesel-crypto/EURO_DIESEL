import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  // Usando a versão Pro que tem maior compatibilidade regional
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const { servicos, pecas, total } = req.body;

    const prompt = `Analise como engenheiro diesel: Serviços R$ ${servicos}, Peças R$ ${pecas}. Dê uma dica técnica curta.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ reply: response.text() });
  } catch (error) {
    console.error(error);
    // Isso vai nos mostrar no log se o erro de localização sumiu
    res.status(500).json({ reply: "Erro de região ou chave. Verifique os logs." });
  }
}
 
