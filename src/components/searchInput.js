import { filterType } from '../index.js'

export const rechercheInput = () => {
  const formulaireRecherche = document.getElementById('form-search')
  const champRecherche = formulaireRecherche.querySelector('input[type="search"]')
  const etat = { value: '' }

  const messageErreur = `
    <span
      class="absolute
      left-0 py-2 text-xs
      font-bold text-white
      border-2 rounded bg-rose-500
      px-9 -bottom-12 invalid
      border-rose-500"
    >
      Veuillez saisir au moins 3 caractères
    </span>
  `

  const declencherRecherche = () => {
    const valeurTrimee = champRecherche.value.trim()
    const memeRecherche = valeurTrimee === etat.value

    if (memeRecherche) {
      return
    }

    etat.value = valeurTrimee

    // Retirer le message d'erreur s'il est présent
    formulaireRecherche.classList.remove('error')
    const elementMessageErreur = formulaireRecherche.querySelector('.invalid')
    if (elementMessageErreur) {
      elementMessageErreur.remove()
    }

    // Vérifier si la valeur est invalide (moins de 3 caractères)
    const longueurInvalide = etat.value.length < 3

    if (longueurInvalide) {
      // Si le champ est vide ou contient moins de 3 caractères, afficher toutes les recettes (reset)
      formulaireRecherche.dispatchEvent(
        new CustomEvent('resetRecipes', {
          bubbles: true,
          cancelable: true
        })
      )

      // Afficher le message d'erreur seulement si quelque chose a été tapé
      if (etat.value.length > 0) {
        formulaireRecherche.classList.add('error')
        formulaireRecherche.insertAdjacentHTML('beforeEnd', messageErreur)
      }
    }

    // Si la recherche est valide, déclencher l'événement 'searchRecipes'
    formulaireRecherche.dispatchEvent(
      new CustomEvent('searchRecipes', {
        bubbles: true,
        cancelable: true,
        detail: { type: filterType.TXT, query: etat.value }
      })
    )
  }

  const lorsRecherche = (event) => {
    event.preventDefault()
    declencherRecherche()
  }

  // Recherche automatique sur l'événement 'input'
  const lorsChangementInput = () => {
    declencherRecherche()
  }

  // Écoute la soumission du formulaire
  formulaireRecherche.addEventListener('submit', lorsRecherche)

  // Écoute les modifications en temps réel dans le champ de recherche
  champRecherche.addEventListener('input', lorsChangementInput)

  return etat
}
