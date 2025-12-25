export const getUserHeaderData = (
  email: string,
): { name: string; greeting: string } => {
  if (!email || typeof email !== 'string') {
    return { name: 'User', greeting: 'Hello!' };
  }
  const namePart = email.split('@')[0];
  const formattedName = namePart
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return { name: formattedName || 'User', greeting: 'Hello!' };
};
