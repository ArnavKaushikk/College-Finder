export function jsonOk(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function jsonError(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message });
}
