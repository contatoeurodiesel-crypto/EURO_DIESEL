export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  const GROQ_KEY = process.env.GEMINI_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{
          role: "user",
          content: `Engenheiro Euro Diesel: Analise faturamento de R$ ${servicos} em serviços e R$ ${pecas} em peças. Dica técnica Scania/Volvo curta.`
        }]
      })
    });

    const data = await response.json();

    // ESTA LINHA VAI TE DIZER O ERRO REAL
    if (data.error) {
      return res.status(200).json({ reply: `⚠️ ERRO NA CHAVE GROQ: ${data.error.message}` });
    }

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({ reply: "A IA não retornou dados. Verifique a chave na Vercel." });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Erro de Conexão: " + error.message });
  }
}
