// Procure a parte do POST que trata a IA no seu api/index.js e substitua por isto:
if (req.method === 'POST' && req.body.total) {
    const { servicos, pecas, total } = req.body;
    
    // Ele vai pegar a sua chave gsk_... que está na Vercel
    const KEY = process.env.GEMINI_KEY; 

    try {
        const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Modelo ultra rápido da Groq
                messages: [
                    {
                        role: "system",
                        content: "Você é o consultor técnico da EURO DIESEL. Analise os dados de faturamento e dê um insight motivador e curto em português."
                    },
                    {
                        role: "user",
                        content: `Serviços: ${servicos}, Peças: ${pecas}, Total: ${total}.`
                    }
                ]
            })
        });

        const aiData = await aiRes.json();
        
        // A Groq entrega o texto neste caminho aqui:
        const reply = aiData.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (e) {
        console.error("ERRO GROQ:", e);
        return res.status(500).json({ reply: "FALHA AO CONECTAR COM A INTELIGÊNCIA GROQ." });
    }
}
