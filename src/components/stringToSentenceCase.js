/**
 * Convertit une chaîne de caractères en majuscule initiale.
 * @param {string} chaine - La chaîne de caractères en entrée.
 * @returns {string} La chaîne convertie avec une majuscule en début de phrase.
 */
export const toSentenceCase = (chaine) => {
  return chaine.toLowerCase().charAt(0).toUpperCase() + chaine.slice(1)
}
