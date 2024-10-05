// Fonction pour rechercher des recettes en fonction d'un texte saisi
export const rechercherRecettesParTexte = (value, recipes) => {
  
  return recipes.filter(({ name, ingredients, description }) => {
    const minuscules = value.trim().toLowerCase()

    const correspondanceDansNom = name.toLowerCase().includes(minuscules)
    if (correspondanceDansNom) return true

    const correspondanceDansDescription = description.toLowerCase().includes(minuscules)
    if (correspondanceDansDescription) return true

    const correspondanceDansIngredients = ingredients.some(({ ingredient }) => {
      return ingredient.toLowerCase().includes(minuscules)
    })

    if (correspondanceDansIngredients) return true

    return false
  })
}

export const rechercherRecettesParMotsCles = (filters, recipes) => {
  return recipes.filter(({ ingredients, appliance, ustensils }) => {
    const { value: ingredientsSelectionnes } = filters.ingredients.state
    const { value: appareilsSelectionnes } = filters.appliances.state
    const { value: ustensilesSelectionnes } = filters.ustensils.state

    let correspondanceDansIngredients = true
    let correspondanceDansUstensiles = true
    let correspondanceDansAppareils = true

    if (ingredientsSelectionnes.length > 0) {
      correspondanceDansIngredients = ingredientsSelectionnes.every((selection) =>
        ingredients.some(({ ingredient }) =>
          ingredient.toLowerCase().includes(selection)  // Correspondance partielle
        )
      )
    }

    if (appareilsSelectionnes.length > 0) {
      correspondanceDansAppareils = appareilsSelectionnes.every((selection) =>
        appliance.toLowerCase().includes(selection)  // Correspondance partielle
      )
    }

    if (ustensilesSelectionnes.length > 0) {
      correspondanceDansUstensiles = ustensilesSelectionnes.every((selection) =>
        ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(selection)  // Correspondance partielle
        )
      )
    }

    return correspondanceDansIngredients && correspondanceDansAppareils && correspondanceDansUstensiles
  })
}
