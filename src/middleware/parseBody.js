export async function parseBody(req, res) {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('text/csv')) {
    req.body = null;
    res.setHeader('Content-Type', 'application/json');
    return;
  }

  const buffer = [];

  for await (const chunk of req) {
    buffer.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffer).toString());
  } catch (error) {
    req.body = null;
  }

  res.setHeader('Content-Type', 'application/json');
}
