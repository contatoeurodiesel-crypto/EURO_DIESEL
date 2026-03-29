export default async function handler(req, res) {
  const { servicos, pecas } = req.body;
  const API_KEY = process.env.GEMINI_KEY;
  
  // URL AJUSTADA PARA A ROTA QUE O GOOGLE EXIGE NO MOMENTO
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

    // Se o Google devolver erro, pegamos a mensagem real aqui
    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "ERRO DE MOTOR: " + error.message });
  }
}
