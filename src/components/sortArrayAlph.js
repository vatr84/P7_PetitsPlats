/**
 * Trie un tableau par ordre alphabétique.
 *
 * @param {Array} array - Le tableau à trier.
 * @returns {Array} - Le tableau trié.
 */
export const sortArrayAlphabeticaly = (tableau, locale = 'fr') => {
  return tableau.toSorted((chaineA, chaineB) =>
    chaineA.localeCompare(chaineB, locale, { ignorePunctuation: true })
  )
}
