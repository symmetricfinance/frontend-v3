export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function isLikelyInUK(): boolean {
  const timezone = getUserTimezone();
  return timezone === 'Europe/London';
}
