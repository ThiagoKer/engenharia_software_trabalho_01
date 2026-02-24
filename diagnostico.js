// Script de Diagnóstico Completo do Backend
const { pool, query } = require('./config/database');

async function diagnostico() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🔍 DIAGNÓSTICO COMPLETO DO BACKEND - GAMER ALPHA');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // 1. Testar conexão com banco
    console.log('1️⃣  Testando conexão com PostgreSQL...');
    const dbTest = await query('SELECT NOW() as now, current_database() as db, version() as version');
    console.log('   ✅ CONECTADO');
    console.log('   📊 Banco:', dbTest.rows[0].db);
    console.log('   📅 Data/Hora:', new Date(dbTest.rows[0].now).toLocaleString('pt-BR'));
    console.log('   🔧 Versão:', dbTest.rows[0].version.split(',')[0]);

    // 2. Verificar tabelas
    console.log('\n2️⃣  Verificando tabelas...');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('   ✅ Tabelas encontradas:', tables.rows.length);
    tables.rows.forEach(t => console.log('      -', t.table_name));

    // 3. Contar registros
    console.log('\n3️⃣  Contando registros...');
    const users = await query('SELECT COUNT(*) as count FROM users');
    const categories = await query('SELECT COUNT(*) as count FROM categories');
    const topics = await query('SELECT COUNT(*) as count FROM topics');
    const comments = await query('SELECT COUNT(*) as count FROM comments');
    const likes = await query('SELECT COUNT(*) as count FROM likes');

    console.log('   👥 Usuários:', users.rows[0].count);
    console.log('   🏷️  Categorias:', categories.rows[0].count);
    console.log('   📝 Tópicos:', topics.rows[0].count);
    console.log('   💬 Comentários:', comments.rows[0].count);
    console.log('   ❤️  Likes:', likes.rows[0].count);

    // 4. Verificar usuário admin
    console.log('\n4️⃣  Verificando usuário admin...');
    const admin = await query('SELECT username, email, is_admin FROM users WHERE username = $1', ['admin']);
    if (admin.rows.length > 0) {
      console.log('   ✅ Usuário admin encontrado');
      console.log('      Email:', admin.rows[0].email);
      console.log('      É Admin:', admin.rows[0].is_admin ? 'Sim' : 'Não');
    } else {
      console.log('   ⚠️  Usuário admin NÃO encontrado!');
    }

    // 5. Listar categorias
    console.log('\n5️⃣  Listando categorias...');
    const cats = await query('SELECT name, slug FROM categories ORDER BY name');
    if (cats.rows.length > 0) {
      console.log('   ✅ Categorias disponíveis:');
      cats.rows.forEach(c => console.log(`      - ${c.name} (${c.slug})`));
    } else {
      console.log('   ⚠️  Nenhuma categoria encontrada!');
    }

    // 6. Testar variáveis de ambiente
    console.log('\n6️⃣  Verificando configurações (.env)...');
    console.log('   📡 PORT:', process.env.PORT || '3000 (padrão)');
    console.log('   🗄️  DB_HOST:', process.env.DB_HOST || 'localhost (padrão)');
    console.log('   👤 DB_USER:', process.env.DB_USER || 'postgres (padrão)');
    console.log('   📊 DB_NAME:', process.env.DB_NAME || 'gamer_alpha (padrão)');
    console.log('   🔐 JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado ✅' : 'NÃO configurado ⚠️');
    console.log('   🌍 NODE_ENV:', process.env.NODE_ENV || 'development (padrão)');

    // 7. Verificar se servidor está rodando
    console.log('\n7️⃣  Status do servidor...');
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('   ✅ Servidor RODANDO');
          console.log('   📡 Status:', health.status);
          console.log('   💬 Mensagem:', health.message);
          finalizarDiagnostico();
        } catch (e) {
          console.log('   ⚠️  Resposta inesperada do servidor');
          finalizarDiagnostico();
        }
      });
    });

    req.on('error', () => {
      console.log('   ❌ Servidor NÃO está rodando!');
      console.log('   💡 Inicie com: npm run dev');
      finalizarDiagnostico();
    });

    req.end();

  } catch (error) {
    console.error('\n❌ ERRO durante diagnóstico:');
    console.error(error.message);
    process.exit(1);
  }
}

function finalizarDiagnostico() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   ✨ DIAGNÓSTICO CONCLUÍDO');
  console.log('═══════════════════════════════════════════════════════════');
  pool.end();
  process.exit(0);
}

// Executar diagnóstico
diagnostico();
