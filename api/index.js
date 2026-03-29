export default async function handler(req, res) {
  // Coleta os dados que o seu index.html está enviando
  const { servicos, pecas } = req.body;
  const API_KEY = process.env.GEMINI_KEY; // Sua chave da Groq está aqui

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // MODELO ATUALIZADO (O Llama 3.3 é o topo de linha atual da Groq)
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content: "Você é o Engenheiro Chefe da Euro Diesel, especialista em mecatrônica de Scania e Volvo."
          },
          {
            role: "user",
            content: `Faturamento atual: R$ ${servicos} em serviços e R$ ${pecas} em peças. Com base nisso, dê uma dica técnica curta (máximo 2 linhas) para mecânicos de pesados.`
          }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();

    // Se houver erro de API, ele avisa aqui
    if (data.error) {
      return res.status(200).json({ reply: `⚠️ ERRO GROQ: ${data.error.message}` });
    }

    // Pega a resposta da IA e envia para o seu Painel
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "ERRO DE CONEXÃO: " + error.message });
  }
}
