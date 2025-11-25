const fetch = global.fetch;

async function login() {
  const response = await fetch("http://localhost:3000/api/admin/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "admin@kwsc.local",
      password: "ChangeMeNow!123",
      rememberDevice: false,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Login failed (${response.status}): ${body?.error || "Unknown error"}`);
  }

  const cookie = response.headers.get("set-cookie");
  if (!cookie) {
    throw new Error("Login succeeded but no session cookie returned");
  }
  return cookie.split(",").map((part) => part.trim())[0];
}

async function fetchServices(cookie) {
  const response = await fetch("http://localhost:3000/api/admin/services", {
    headers: {
      cookie,
    },
  });
  const payload = await response.json().catch(() => null);
  return { status: response.status, payload };
}

async function main() {
  const cookie = await login();
  const { status, payload } = await fetchServices(cookie);
  if (status !== 200) {
    throw new Error(`Services API returned ${status}: ${payload?.error || "Unknown error"}`);
  }
  console.log(`Services API returned ${payload?.data?.length ?? 0} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
