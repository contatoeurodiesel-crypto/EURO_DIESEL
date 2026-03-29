export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  const API_KEY = process.env.GEMINI_KEY;
  
  // Rota estável para chaves novas
  const URL = https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY};
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analise como engenheiro da Euro Diesel: Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica curta sobre Scania ou Volvo.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: "ERRO DE CHAVE: " + data.error.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "ERRO DE SISTEMA: " + error.message });
  }
}
