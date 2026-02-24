const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function killPort3000() {
  try {
    if (process.platform === 'win32') {
      // Encontra o PID que está usando a porta 3000
      const { stdout } = await execAsync('netstat -ano | findstr :3000');
      const lines = stdout.trim().split('\n');
      
      const pids = new Set();
      for (const line of lines) {
        const match = line.match(/LISTENING\s+(\d+)/);
        if (match) {
          pids.add(match[1]);
        }
      }
      
      // Mata cada processo
      for (const pid of pids) {
        try {
          await execAsync(`taskkill /F /PID ${pid}`);
          console.log(`✅ Processo ${pid} encerrado (porta 3000)`);
        } catch (err) {
          // Ignora erros
        }
      }
      
      if (pids.size === 0) {
        console.log('✅ Porta 3000 livre');
      }
    } else {
      // Linux/Mac
      await execAsync('lsof -ti:3000 | xargs kill -9').catch(() => {});
      console.log('✅ Porta 3000 liberada');
    }
  } catch (error) {
    console.log('✅ Porta 3000 livre');
  }
}

killPort3000();
