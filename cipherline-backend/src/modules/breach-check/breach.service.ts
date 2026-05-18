export async function runBreachCheck(body: unknown) {
  // TODO: SHA-1 hash password, query HIBP API with first 5 chars, check result
}

export async function clearBreachResult(id: string | undefined) {
  // TODO: clear breach_status for the given entry
}
