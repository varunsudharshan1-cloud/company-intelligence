export async function GET() {
  return Response.json({
    status: "online",
    server: "running",
  });
}