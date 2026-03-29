import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Configura a IA com a sua chave segura
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // 2. Recebe os dados do seu dashboard
    const { servicos, pecas, total } = req.body;

    // 3. Monta o comando técnico
    const prompt = `Você é o Engenheiro Chefe da Euro Diesel Mecatrônica. 
    Analise estes valores atuais: Serviços R$ ${servicos}, Peças R$ ${pecas}, Total R$ ${total}.
    Dê um conselho técnico de ALTO NÍVEL para a oficina focado em sistemas diesel modernos (Scania/Volvo). 
    Seja breve (máximo 3 frases) e motivador.`;

    // 4. Chama a IA (Sintaxe correta para evitar Erro 400)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Devolve a resposta para o site
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).json({ reply: "A IA da Euro Diesel está em manutenção. Tente em instantes." });
  }
}
