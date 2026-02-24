// Teste Rápido de Login
const API_BASE = 'http://localhost:3000';

async function testarLogin() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   🔐 TESTE DE LOGIN - GAMER ALPHA');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        console.log('1️⃣  Tentando fazer login...');
        console.log('   Usuário: admin');
        console.log('   Senha: admin123\n');

        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            }),
            credentials: 'include'
        });

        console.log('   Status:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ LOGIN BEM-SUCEDIDO!\n');
            console.log('   Dados do usuário:');
            console.log('   - ID:', data.user.id);
            console.log('   - Username:', data.user.username);
            console.log('   - Email:', data.user.email);
            console.log('   - É Admin:', data.user.is_admin ? 'Sim' : 'Não');
            console.log('\n2️⃣  Testando rota autenticada (GET /api/auth/me)...\n');

            const meResponse = await fetch(`${API_BASE}/api/auth/me`, {
                credentials: 'include'
            });

            if (meResponse.ok) {
                const meData = await meResponse.json();
                console.log('   ✅ TOKEN JWT FUNCIONANDO!');
                console.log('   Usuário autenticado:', meData.user.username);
            } else {
                console.log('   ⚠️  Problema ao verificar token');
            }

        } else {
            const error = await response.json();
            console.log('   ❌ LOGIN FALHOU!');
            console.log('   Erro:', error.message);
        }

    } catch (error) {
        console.log('   ❌ ERRO DE CONEXÃO!');
        console.log('   Mensagem:', error.message);
        console.log('\n   💡 Certifique-se de que o servidor está rodando:');
        console.log('      cd back-end');
        console.log('      npm run dev');
    }

    console.log('\n═══════════════════════════════════════════════════════════');
}

testarLogin();
