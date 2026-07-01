const fs = require('fs');
const autocannon = require('autocannon');

async function runTest(connections) {
  console.log(`Running load test on Next.js frontend with ${connections} concurrent connections for 5 seconds...`);
  const result = await autocannon({
    url: 'http://localhost:3000/login',
    connections: connections,
    duration: 5,
    pipelining: 1
  });
  
  return {
    connections: connections,
    requestsPerSecond: result.requests.average,
    latencyAverageMs: result.latency.average,
    latencyP99Ms: result.latency.p99,
    totalRequests: result.requests.total,
    errors: result.errors,
    timeouts: result.timeouts
  };
}

(async () => {
  try {
    const results = [];
    
    // Test 50 connections
    const r50 = await runTest(50);
    results.push(r50);
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 200 connections
    const r200 = await runTest(200);
    results.push(r200);
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 500 connections
    const r500 = await runTest(500);
    results.push(r500);
    
    console.log("Writing results to scratch/load_test_results.json...");
    fs.writeFileSync('scratch/load_test_results.json', JSON.stringify(results, null, 2));
    console.log("Load testing completed successfully!", results);
  } catch (err) {
    console.error("Error running load tests:", err);
    process.exit(1);
  }
})();
