export function generateUserId(): string {
  let userId = "";
  const character =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const id_length = 10; // length of id is 10 characters
  for (let i = 0; i < id_length; i++) {
    userId += character.charAt(Math.floor(Math.random() * character.length));
  }
  return userId;
}
