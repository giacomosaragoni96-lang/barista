/** Minuscole, senza accenti; apostrofi, trattini e simboli diventano spazio; spazi singoli. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
