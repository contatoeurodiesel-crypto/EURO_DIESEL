import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
    const client = createClient();
    await client.connect();

    try {
        // --- AÇÃO: APAGAR (DELETAR) ---
        if (req.method === 'DELETE') {
            const { id } = req.body;
            // Marcamos como excluído no banco
            await client.sql`UPDATE euro_lancamentos SET excluido = true WHERE id = ${id}`;
            return res.status(200).json({ success: true });
        }

        // --- AÇÃO: SALVAR LANÇAMENTO ---
        if (req.method === 'POST') {
            const { usuario, tipo, desc, val } = req.body;
            await client.sql`INSERT INTO euro_lancamentos (usuario, tipo, descricao, valor) VALUES (${usuario}, ${tipo}, ${desc}, ${val})`;
            return res.status(200).json({ success: true });
        }

        // --- AÇÃO: BUSCAR LANÇAMENTOS (Dashboard) ---
        const { rows } = await client.sql`SELECT * FROM euro_lancamentos WHERE excluido = false ORDER BY data_registro DESC`;
        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}
