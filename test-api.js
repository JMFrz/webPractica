#!/usr/bin/env node

/**
 * Script de pruebas para la API TextME
 * Ejecutar con: node test-api.js
 */

const http = require('http');

// Configuración
const API_HOST = 'localhost';
const API_PORT = 5000;

// Función para hacer requests HTTP
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Función para imprimir resultados
function printResult(testName, result) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(60));
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
}

// Suite de pruebas
async function runTests() {
  try {
    console.log('🚀 Iniciando pruebas de la API TextME\n');

    // Test 1: Crear un mensaje
    console.log('1️⃣ Creando primer mensaje...');
    const createMsg1 = await makeRequest('POST', '/api/message', {
      de: 'juan@example.com',
      para: 'maria@example.com',
      asunto: 'Hola Maria',
      contenido: 'Este es el primer mensaje de prueba',
      adjunto: null,
      token: null
    });
    printResult('Crear mensaje 1', createMsg1);

    // Test 2: Crear otro mensaje
    console.log('\n2️⃣ Creando segundo mensaje...');
    const createMsg2 = await makeRequest('POST', '/api/message', {
      de: 'maria@example.com',
      para: 'juan@example.com',
      asunto: 'Re: Hola Maria',
      contenido: 'Hola Juan, recibí tu mensaje',
      adjunto: 'https://example.com/image.jpg',
      token: null
    });
    printResult('Crear mensaje 2', createMsg2);

    // Test 3: Obtener mensajes de juan@example.com
    console.log('\n3️⃣ Obteniendo mensajes de juan@example.com...');
    const juanMessages = await makeRequest('GET', '/api/messages/user/juan@example.com');
    printResult('Obtener mensajes de Juan', juanMessages);

    // Test 4: Obtener mensajes de maria@example.com
    console.log('\n4️⃣ Obteniendo mensajes de maria@example.com...');
    const mariaMessages = await makeRequest('GET', '/api/messages/user/maria@example.com');
    printResult('Obtener mensajes de María', mariaMessages);

    // Test 5: Obtener un mensaje completo
    if (createMsg1.data.data && createMsg1.data.data.id) {
      console.log('\n5️⃣ Obteniendo mensaje completo...');
      const messageId = createMsg1.data.data.id;
      const completeMessage = await makeRequest('GET', `/api/message/${messageId}`);
      printResult(`Obtener mensaje completo (${messageId})`, completeMessage);
    }

    // Test 6: Intentar crear mensaje sin campos requeridos
    console.log('\n6️⃣ Intentando crear mensaje sin campos requeridos...');
    const invalidMsg = await makeRequest('POST', '/api/message', {
      de: 'usuario@example.com'
      // Falta: para, asunto, contenido
    });
    printResult('Crear mensaje inválido', invalidMsg);

    console.log('\n\n✅ Pruebas completadas\n');
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
runTests();
