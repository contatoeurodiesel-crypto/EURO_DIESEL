export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  const API_KEY = process.env.GEMINI_KEY;
  
  // MUDAMOS PARA O MODELO MAIS ESTÁVEL DO MUNDO (Gemini Pro)
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Engenheiro Mecatrônico Euro Diesel: Analise faturamento de Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica de 2 frases sobre manutenção de bicos injetores ou turbinas Scania/Volvo.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Se der erro, vamos mostrar exatamente o que o Google diz
      return res.status(500).json({ reply: "ERRO GOOGLE: " + data.error.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "ERRO DE CONEXÃO: " + error.message });
  }
}
