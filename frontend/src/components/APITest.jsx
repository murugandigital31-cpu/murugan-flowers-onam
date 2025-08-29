import React, { useState } from 'react';

const APITest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAPITest = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      
      // Test flower stock endpoint
      const flowerResponse = await fetch('http://localhost:5000/api/flowers');
      const flowerData = await flowerResponse.json();
      
      setTestResults({
        health: { success: healthResponse.ok, data: healthData },
        flowers: { success: flowerResponse.ok, data: flowerData }
      });
    } catch (error) {
      setTestResults({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>API Connection Test</h3>
      <button 
        className="btn btn-primary mb-2" 
        onClick={runAPITest}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Run API Test'}
      </button>
      
      {testResults && (
        <div className="test-results">
          <h4>Test Results:</h4>
          {testResults.error ? (
            <div className="error-message">
              <strong>Error:</strong> {testResults.error}
            </div>
          ) : (
            <div>
              <div className={testResults.health.success ? 'text-success' : 'text-error'}>
                <strong>Health Check:</strong> {testResults.health.success ? 'PASS' : 'FAIL'}
                {testResults.health.data && (
                  <pre>{JSON.stringify(testResults.health.data, null, 2)}</pre>
                )}
              </div>
              <div className={testResults.flowers.success ? 'text-success' : 'text-error'}>
                <strong>Flower Stock:</strong> {testResults.flowers.success ? 'PASS' : 'FAIL'}
                {testResults.flowers.data && (
                  <pre>{JSON.stringify(testResults.flowers.data.slice(0, 3), null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APITest;