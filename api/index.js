export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  const API_KEY = process.env.GEMINI_KEY;
  
  // URL DIRETA PARA A VERSÃO ESTÁVEL v1 (Isso evita o erro 404 da v1beta)
  const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é o Engenheiro Chefe da Euro Diesel. Analise: Serviços R$ ${servicos} e Peças R$ ${pecas}. Dê uma dica técnica de 2 frases sobre manutenção Common Rail, Scania ou Volvo.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "ERRO DE COMUNICAÇÃO: " + error.message });
  }
}
