export default function DocsPage() {
  return (
    <div className="p-8">
      <h1>API Documentation</h1>

      <div>
        <h2>GET /api/health</h2>
        <p>Status: 200 OK</p>
        <pre>{`{
  "status": "healthy",
  "service": "company-intelligence"
}`}</pre>
      </div>

      <div>
        <h2>GET /api/status</h2>
        <p>Status: 200 OK</p>
        <pre>{`{
  "status": "online",
  "server": "running"
}`}</pre>
      </div>

      <div>
        <h2>GET /api/version</h2>
        <p>Status: 200 OK</p>
        <pre>{`{
  "version": "1.0.0"
}`}</pre>
      </div>

      <div>
        <h2>POST /api/analyze</h2>
        <p>Status: 200 OK</p>
        <pre>{`{
  "company": "Microsoft"
}`}</pre>
      </div>
    </div>
  );
}