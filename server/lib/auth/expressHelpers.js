export function setSessionCookie(res, cookie) {
  res.cookie(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
}

export function clearSessionCookie(res, cookie) {
  res.clearCookie(cookie.name, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
  });
}
