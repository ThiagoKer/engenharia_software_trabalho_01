// Script de teste da API
const API_BASE = 'http://localhost:3000';

async function testarAPI() {
    console.log('=== TESTANDO API GAMER ALPHA ===\n');

    // 1. Health Check
    try {
        const health = await fetch(`${API_BASE}/api/health`);
        const healthData = await health.json();
        console.log('✓ Health Check:', healthData.message);
    } catch (e) {
        console.error('✗ Health Check falhou:', e.message);
        return;
    }

    // 2. Listar Categorias
    try {
        const cats = await fetch(`${API_BASE}/api/categories`);
        const catsData = await cats.json();
        console.log(`✓ Categorias: ${catsData.categories.length} encontradas`);
    } catch (e) {
        console.error('✗ Erro ao listar categorias:', e.message);
    }

    // 3. Listar Tópicos
    try {
        const topics = await fetch(`${API_BASE}/api/topics`);
        const topicsData = await topics.json();
        console.log(`✓ Tópicos: ${topicsData.topics.length} encontrados`);
    } catch (e) {
        console.error('✗ Erro ao listar tópicos:', e.message);
    }

    console.log('\n=== TESTE CONCLUÍDO ===');
}

testarAPI();
