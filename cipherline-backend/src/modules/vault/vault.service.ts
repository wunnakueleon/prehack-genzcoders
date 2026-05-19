export async function listEntries(userId: string | undefined) {
  // TODO: query all PasswordEntry rows for the given userId, return array
}

export async function addEntry(body: unknown) {
  // TODO: validate body (userId, siteName, usernameForSite, encryptedPassword, siteUrl?, expiryDate?), insert row, return created entry
}

export async function editEntry(id: string | undefined, body: unknown) {
  // TODO: validate body fields, update PasswordEntry by id, return updated entry
}

export async function removeEntry(id: string | undefined) {
  // TODO: delete PasswordEntry by id, return deleted entry
}
