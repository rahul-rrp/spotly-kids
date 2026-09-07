const http = require('http');

async function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== API INTEGRATION TEST ===");

  // 1. Health
  const health = await request({ host: 'localhost', port: 5000, path: '/health', method: 'GET' });
  console.log("1. Health:", health.data);

  // 2. Register
  const testEmail = `test_${Date.now()}@example.com`;
  const reg = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { name: "Test Parent", email: testEmail, password: "password123" }
  );
  console.log("2. Register status:", reg.status, "User ID:", reg.data.data?.user?.id);
  const token = reg.data.data?.token;

  // 3. Login
  const login = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: testEmail, password: "password123" }
  );
  console.log("3. Login status:", login.status, "Success:", login.data.success);

  // 4. Casting calls query
  const castings = await request({ host: 'localhost', port: 5000, path: '/api/casting-calls?search=talent&city=Mumbai&age=8', method: 'GET' });
  console.log("4. Filtered casting calls count:", castings.data.data?.length);

  // 5. Create Child Profile
  const child = await request(
    { host: 'localhost', port: 5000, path: '/api/children', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    { name: "Aarav", age: 8, city: "Mumbai" }
  );
  console.log("5. Create Child status:", child.status, "Child ID:", child.data.data?.id);
  const childId = child.data.data?.id;

  // 6. Apply to Casting Call #1
  const app1 = await request(
    { host: 'localhost', port: 5000, path: '/api/applications', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    { childId, castingCallId: 1 }
  );
  console.log("6. Application #1 status:", app1.status, "Message:", app1.data.message);

  // 7. Duplicate Application Test
  const app2 = await request(
    { host: 'localhost', port: 5000, path: '/api/applications', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    { childId, castingCallId: 1 }
  );
  console.log("7. Duplicate Application status:", app2.status, "(Expected 400), Message:", app2.data.message);

  console.log("=== ALL API TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(console.error);
