import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Aqui usamos a variável de ambiente para ninguém roubar sua chave
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { servicos, pecas, total } = req.body;

    const prompt = `Você é o Engenheiro Chefe da Euro Diesel Mecatrônica. 
Analise os números: Serviços ${servicos}, Peças ${pecas}, Total ${total}. 
Dê um conselho técnico de ALTO NÍVEL (Dica de Ouro). 
Exemplos: Se o faturamento de serviços estiver baixo, sugira focar em Diagnóstico Computadorizado em Scania/Volvo. 
Se as peças estiverem baixas, sugira revisão de bombas injetoras e bicos. 
Use termos técnicos como "Unidades Injetoras", "Sistemas Common Rail" e "Scanner Avançado". 
Seja motivador, profissional e curto (máximo 3 frases).`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Erro na conexão com a IA" });
    }
}
