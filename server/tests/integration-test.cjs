const gateway = require('../services/api-gateway.cjs');
const assert = require('assert');

async function runTests() {
  console.log('🚀 Starting AgriFlight API Gateway Tests...');

  try {
    // 1. Test Local API - Weather
    console.log('Testing Local Weather API...');
    const weather = await gateway.request('local', 'getLocalWeather', 'Bangkok');
    assert.strictEqual(weather.province, 'Bangkok');
    assert.strictEqual(typeof weather.temp, 'number');
    console.log('✅ Local Weather API OK');

    // 2. Test Partner API - FarmOS Assets
    console.log('Testing FarmOS Assets Integration...');
    const assets = await gateway.request('partners', 'getFarmAssets');
    assert(Array.isArray(assets));
    assert(assets.length > 0);
    assert.strictEqual(assets[0].provider, 'FarmOS');
    console.log('✅ FarmOS Assets Integration OK');

    // 3. Test Partner API - OpenAg Research
    console.log('Testing OpenAg Research Data Integration...');
    const research = await gateway.request('partners', 'getResearchData', 'Rice');
    assert.strictEqual(research.crop, 'Rice');
    assert(research.pestWarnings.length > 0);
    console.log('✅ OpenAg Research Integration OK');

    // 4. Test Caching
    console.log('Testing Gateway Caching...');
    const start = Date.now();
    await gateway.request('local', 'getLocalWeather', 'Bangkok');
    const end = Date.now();
    assert(end - start < 10, 'Cache should return data in less than 10ms');
    console.log('✅ Gateway Caching OK');

    console.log('\n✨ All Integration Tests Passed Successfully!');
  } catch (error) {
    console.error('\n❌ Tests Failed:', error.message);
    process.exit(1);
  }
}

runTests();
