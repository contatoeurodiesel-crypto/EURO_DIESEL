export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_KEY}`, // Use a chave da Groq aqui
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Modelo ultra rápido
        messages: [{
          role: "user",
          content: `Engenheiro Euro Diesel: Analise faturamento de R$ ${servicos} em serviços e R$ ${pecas} em peças. Dica técnica Scania/Volvo curta.`
        }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Erro Groq: " + error.message });
  }
}
