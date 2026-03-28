import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Aqui usamos a variável de ambiente para ninguém roubar sua chave
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { servicos, pecas, total } = req.body;

    const prompt = `Consultor Euro Diesel. Analise: Serviços ${servicos}, Peças ${pecas}, Total ${total}. 
    Dê um conselho curto e motivador de especialista em diesel. Máximo 3 frases.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Erro na conexão com a IA" });
    }
}
