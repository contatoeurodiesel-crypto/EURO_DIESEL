import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
    const client = createClient();
    await client.connect();

    try {
        // --- 1. SE FOR IA (GROQ) ---
        if (req.method === 'POST' && req.body.total) {
            const { servicos, pecas, total } = req.body;
            const KEY = process.env.GEMINI_KEY; 

            const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: `Analise para oficina Euro Diesel: Serv: ${servicos}, Peças: ${pecas}, Total: ${total}. Curto e motivador.` }]
                })
            });
            const aiData = await aiRes.json();
            return res.status(200).json({ reply: aiData.choices[0].message.content });
        }

        // --- 2. SE FOR DELETAR ---
        if (req.method === 'DELETE') {
            const { id } = req.body;
            await client.sql`UPDATE euro_lancamentos SET excluido = true WHERE id = ${id}`;
            return res.status(200).json({ success: true });
        }

        // --- 3. SE FOR SALVAR (USUÁRIO OU PEÇA) ---
        if (req.method === 'POST') {
            const { acao, usuario, tipo, desc, val, nome, senha } = req.body;
            if (acao === 'CADASTRO') {
                await client.sql`INSERT INTO euro_usuarios (nome, senha) VALUES (${nome}, ${senha}) ON CONFLICT (nome) DO NOTHING`;
                return res.status(200).json({ success: true });
            }
            await client.sql`INSERT INTO euro_lancamentos (usuario, tipo, descricao, valor) VALUES (${usuario}, ${tipo}, ${desc}, ${val})`;
            return res.status(200).json({ success: true });
        }

        // --- 4. SE FOR BUSCAR USUÁRIOS ---
        if (req.query.tipo === 'usuarios') {
            const { rows } = await client.sql`SELECT * FROM euro_usuarios`;
            return res.status(200).json(rows);
        }

        // --- 5. BUSCA PADRÃO (DASHBOARD) ---
        const { rows } = await client.sql`SELECT * FROM euro_lancamentos WHERE excluido = false ORDER BY id DESC`;
        return res.status(200).json(rows);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    } finally {
        await client.end();
    }
}
