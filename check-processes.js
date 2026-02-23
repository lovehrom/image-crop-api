// Проверка запущенных процессов

const { exec } = require('child_process');

console.log('=== Проверка запущенных процессов ===');

exec('tasklist | findstr "node.exe"', (error, stdout, stderr) => {
  if (error) {
    console.log('Error:', error.message);
    return;
  }

  console.log('Запущенные Node.js процессы:');
  console.log(stdout);

  if (stdout.includes('node.exe')) {
    console.log('');
    console.log('⚠️ Есть запущенные Node.js процессы');
    console.log('');
    console.log('Возможные причины:');
    console.log('1. Сервер API (npm start) запущен и занимает порт');
    console.log('2. Другие Node.js процессы (npm install, nodemon)');
    console.log('3. Сервисы (Vercel CLI)');
  } else {
    console.log('');
    console.log('✅ Node.js процессы не найдены');
  }
});

exec('tasklist | findstr "vercel"', (error, stdout, stderr) => {
  if (error) {
    return;
  }

  console.log('');
  console.log('Запущенные Vercel процессы:');
  console.log(stdout);
});

exec('netstat -ano | findstr ":3000"', (error, stdout, stderr) => {
  if (error) {
    return;
  }

  console.log('');
  console.log('Порт 3000:');
  console.log(stdout);

  if (stdout.includes('LISTENING')) {
    console.log('');
    console.log('⚠️ Порт 3000 занят!');
  } else {
    console.log('');
    console.log('✅ Порт 3000 свободен');
  }
});

console.log('');
console.log('Проверка завершена.');
