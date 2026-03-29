import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
    const client = createClient();
    await client.connect();

    try {
        // --- AÇÃO: APAGAR LANÇAMENTO (DELETE) ---
        if (req.method === 'DELETE') {
            const { id } = req.body;
            await client.sql`UPDATE euro_lancamentos SET excluido = true WHERE id = ${id}`;
            return res.status(200).json({ success: true });
        }

        if (req.method === 'POST') {
            const { acao, usuario, tipo, desc, val, nome, senha } = req.body;

            // --- AÇÃO: CADASTRAR NOVO USUÁRIO ---
            if (acao === 'CADASTRAR_USUARIO') {
                await client.sql`INSERT INTO euro_usuarios (nome, senha) VALUES (${nome}, ${senha}) ON CONFLICT (nome) DO NOTHING`;
                return res.status(200).json({ success: true });
            }

            // --- AÇÃO: SALVAR PEÇA OU SERVIÇO ---
            await client.sql`INSERT INTO euro_lancamentos (usuario, tipo, descricao, valor) VALUES (${usuario}, ${tipo}, ${desc}, ${val})`;
            return res.status(200).json({ success: true });
        }

        // --- AÇÃO: BUSCAR USUÁRIOS (Para o Login) ---
        if (req.query.tipo === 'usuarios') {
            const { rows } = await client.sql`SELECT * FROM euro_usuarios`;
            return res.status(200).json(rows);
        }

        // --- AÇÃO: BUSCAR TODOS OS LANÇAMENTOS (Dashboard) ---
        const { rows } = await client.sql`SELECT * FROM euro_lancamentos WHERE excluido = false ORDER BY data_registro DESC`;
        return res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}
