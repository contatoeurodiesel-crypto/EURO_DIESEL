import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Inicializa o Google Generative AI com a chave
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  
  // USANDO O MODELO COM A NOMENCLATURA MAIS COMPATÍVEL
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { servicos, pecas } = req.body;

    const prompt = `Você é o Engenheiro Chefe da Euro Diesel. Analise: Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica de 2 frases sobre manutenção Common Rail, Scania ou Volvo.`;

    // Chamada simplificada
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    // Se der erro, vamos ver se é a chave ou o modelo
    res.status(500).json({ reply: "ERRO DE MOTOR: " + error.message });
  }
}
