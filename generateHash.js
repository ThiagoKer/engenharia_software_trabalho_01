// Script para gerar hash de senha para o admin
// Execute: node generateHash.js

const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('================================');
console.log('Hash gerado para senha: admin123');
console.log('================================');
console.log(hash);
console.log('================================');
console.log('\nCopie este hash e cole no arquivo database/schema.sql');
console.log('na linha do INSERT do usuário admin.');
