// Fonction pour rechercher des recettes en fonction d'un texte saisi
export const rechercherRecettesParTexte = (value, recipes) => {
  
  let recettesFiltrees = []
  const minuscules = value.trim().toLowerCase()

  for (let index = 0; index < recipes.length; index++) {
    const { name, ingredients, description } = recipes[index]

    const correspondanceDansNom = name.toLowerCase().includes(minuscules)
    if (correspondanceDansNom) {
      recettesFiltrees.push(recipes[index])
      continue
    }

    const correspondanceDansDescription = description.toLowerCase().includes(minuscules)
    if (correspondanceDansDescription) {
      recettesFiltrees.push(recipes[index])
      continue
    }

    let correspondanceDansIngredients = false
    for (let i = 0; i < ingredients.length; i++) {
      const { ingredient } = ingredients[i]
      if (ingredient.toLowerCase().includes(minuscules)) {
        correspondanceDansIngredients = true
        break
      }
    }

    if (correspondanceDansIngredients) {
      recettesFiltrees.push(recipes[index])
    }
  }

  return recettesFiltrees
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
