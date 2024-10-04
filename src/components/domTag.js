/**
 * Crée un nouvel élément DOM avec le nom de balise et les attributs spécifiés.
 *
 * @param {string} nomBalise - Le nom de la balise de l'élément à créer.
 * @param {Object} [attributs={}] - Les attributs à définir sur l'élément.
 * @param {Array} [enfants=[]] - Les enfants de l'élément.
 * @returns {Element} L'élément nouvellement créé.
 */
export const creerElement = (nomBalise, attributs = {}, enfants = []) => {
  const element = document.createElement(nomBalise)

  if (attributs) {
    for (const [attribut, valeur] of Object.entries(attributs)) {
      if (valeur === null) {
        return element
      }

      element.setAttribute(attribut, valeur)
    }
  }

  enfants.forEach((enfant) => element.appendChild(enfant))

  return element
}
