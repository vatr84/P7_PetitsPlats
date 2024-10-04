import { filterType } from '../index.js'
import { sortArrayAlphabeticaly } from './sortArrayAlph.js'
import { creerElement } from './domTag.js'
import { toSentenceCase } from './stringToSentenceCase.js'

export const creerFiltres = (recettes) => {
  const filtreIngredients = document.getElementById('ingredients-filter')
  const filtreAppareils = document.getElementById('appliances-filter')
  const filtreUstensiles = document.getElementById('ustensils-filter')
  const motsCles = creerMotsCles(recettes)

  return {
    ingredients: filtreParMotCle(
      'ingredients',
      motsCles.ingredients(),
      filtreIngredients
    ),
    appliances: filtreParMotCle(
      'appliances',
      motsCles.appliances(),
      filtreAppareils
    ),
    ustensils: filtreParMotCle('ustensils', motsCles.ustensils(), filtreUstensiles)
  }
}

const creerMotsCles = (recettes) => {
  const ingredients = () => {
    const ingredients = recettes.reduce((ingredients, { ingredients: ings }) => {
      ings.forEach(({ ingredient }) => {
        const ingredientMC = toSentenceCase(ingredient)

        if (!ingredients.includes(ingredientMC)) {
          ingredients.push(ingredientMC)
        }
      })

      return ingredients
    }, [])

    return sortArrayAlphabeticaly(ingredients)
  }

  const appliances = () => {
    const appliances = recettes.reduce((appliances, { appliance }) => {
      const appareilMC = toSentenceCase(appliance)

      if (!appliances.includes(appareilMC)) {
        appliances.push(appareilMC)
      }

      return appliances
    }, [])

    return sortArrayAlphabeticaly(appliances)
  }

  const ustensils = () => {
    const ustensils = recettes.reduce((ustensils, { ustensils: ustls }) => {
      ustls.forEach((ustensil) => {
        const ustensilMC = toSentenceCase(ustensil)

        if (!ustensils.includes(ustensilMC)) {
          ustensils.push(ustensilMC)
        }
      })

      return ustensils
    }, [])

    return sortArrayAlphabeticaly(ustensils)
  }

  return {
    ingredients,
    appliances,
    ustensils
  }
}

const filtreParMotCle = (nom, motsCles, element) => {
  const state = {
    value: []
  }

  if (element instanceof HTMLElement === false) {
    return
  }

  const listeMotsCles = element.querySelector('.keywords-list')
  const listeMotsClesActifs = element.querySelector('.active-keywords-list')
  const tagsMotsCles = document.getElementById('keywords-tags')
  const buttonDropdown = element.querySelector('button')
  const filter = element.querySelector('form')

  const init = () => {
    buttonDropdown.addEventListener('click', onButtonDropdown)

    listeMotsCles.innerHTML = ''

    motsCles.forEach((keyword) => {
      const option = creerOption(keyword)
      listeMotsCles.appendChild(option)
    })

    filter.addEventListener('submit', filterOptions)
  }

  const onButtonDropdown = (event) => {
    document.querySelectorAll('.dropdown').forEach((dropdown) => {
      if (dropdown !== event.target.nextElementSibling) {
        dropdown.classList.add('hidden')
      }
    })

    const isExpanded = event.target.getAttribute('aria-expanded') === 'true'
    const dropdown = event.target.nextElementSibling
    dropdown.classList.toggle('hidden')
    event.target.setAttribute('aria-expanded', !isExpanded)
  }

  const filterOptions = (event) => {
    event.preventDefault()

    listeMotsCles.querySelector('.no-result')?.remove()
    const input = event.target.querySelector('input')
    const value = input.value.trim().toLowerCase()
    const options = listeMotsCles.querySelectorAll('[role="option"]')

    let resultat = false

    options.forEach((option) => {
      const text = option.innerText.toLowerCase()
      const correspondant = text.includes(value)
      option.classList.toggle('hidden', !correspondant)

      if (correspondant) {
        resultat = true
      }
    })

    if (!resultat) {
      displayNoResults()
    }
  }

  const updateOptions = (recettes) => {
    filter.reset()
    listeMotsCles.innerHTML = ''
  
    const motsCles = creerMotsCles(recettes)[nom]()
    
    // Exclure uniquement les mots-clés strictement identiques des options
    const notSelectedKeywords = motsCles.filter(
      (keyword) => !state.value.includes(keyword.toLowerCase())
    )
  
    if (notSelectedKeywords.length === 0) {
      displayNoResults()
    }
  
    notSelectedKeywords.forEach((keyword) => {
      const option = creerOption(keyword)
      listeMotsCles.appendChild(option)
    })
  }

  const displayNoResults = () => {
    if (listeMotsCles.querySelector('.no-result') === null) {
      listeMotsCles.insertAdjacentHTML(
        'beforeend',
        '<div class="px-4 py-2 text-sm no-result">Aucun résultat.</div>'
      )
    }
  }

  const creerOption = (option) => {
    const optionElement = creerElement('div', {
      'data-id': `${option}`,
      class:
        'px-4 py-2 text-sm hover:bg-yellow hover:font-bold cursor-pointer flex justify-between items-center',
      'aria-selected': false,
      role: 'option'
    })

    optionElement.innerText = option
    optionElement.addEventListener('click', ajouterOption)

    return optionElement
  }

  const ajouterOption = (event) => {
    const { target } = event
  
    const keyword = target.innerText.trim().toLowerCase()
  
    // Vérifier si le mot-clé exact est déjà sélectionné
    if (!state.value.includes(keyword)) {
      // Ajouter l'option à la liste active et comme tag
      ajouterOptionActive(target)
      ajouterTag(target.getAttribute('data-id'))
      state.value.push(keyword)  // Ajouter le mot-clé à la liste des mots-clés sélectionnés
      
      notifierChangement()  // Notifier le changement pour mettre à jour les résultats de la recherche
    }
  }

  const retirerOption = (event) => {
    const { target } = event

    const tag = tagsMotsCles.querySelector(
      `[data-id="${target.getAttribute('data-id')}"]`
    )

    enleverOption(target)
    enleverTag(tag)
    retirerMotCleSelectionne(target)
    notifierChangement()
  }

  const retirerTag = (event) => {
    const { target } = event

    const option = listeMotsClesActifs.querySelector(
      `[data-id="${target.getAttribute('data-id')}"]`
    )

    enleverOption(option)
    enleverTag(target)
    retirerMotCleSelectionne(target)
    notifierChangement()
  }

  const retirerMotCleSelectionne = (option) => {
    const keyword = option.innerText.trim().toLowerCase()
  
    // Ne retirer que le mot-clé spécifique et non les autres similaires
    state.value = state.value.filter((k) => k !== keyword)
  }

  const notifierChangement = () => {
    const event = new CustomEvent('searchRecipes', {
      bubbles: true,
      cancelable: true,
      detail: { type: filterType.KEYWORDS }
    })

    element.dispatchEvent(event)
  }

  const ajouterOptionActive = (option) => {
    listeMotsClesActifs.appendChild(option)
    option.setAttribute('aria-selected', true)
    option.removeEventListener('click', ajouterOption)
    option.addEventListener('click', retirerOption)
    option.classList.add('active')
    option.insertAdjacentHTML(
      'beforeend',
      '<i class="pointer-events-none opacity-0 fa-solid fa-circle-xmark" aria-hidden="true"></i>'
    )
  }

  const ajouterTag = (keyword) => {
    const tag = creerElement('div', {
      'data-id': `${keyword}`,
      class:
        'cursor-pointer flex items-center px-4 py-4 rounded-sm gap-x-4 bg-yellow lg:gap-x-14'
    })

    const innerTag = `
      <span class="text-sm">${keyword}</span>
      <i class="pointer-events-none fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
    `

    tag.innerHTML = innerTag
    tag.addEventListener('click', retirerTag)
    tagsMotsCles.appendChild(tag)
  }

  const enleverOption = (activeOption) => {
    listeMotsCles.insertAdjacentElement('afterbegin', activeOption)
    activeOption.setAttribute('aria-selected', false)
    activeOption.removeEventListener('click', retirerOption)
    activeOption.addEventListener('click', ajouterOption)
    activeOption.classList.remove('active')
    activeOption.querySelector('i').remove()
  }

  const enleverTag = (tag) => {
    tag.remove()
  }

  if (buttonDropdown) {
    init()
  }

  return {
    nom,
    state,
    updateOptions
  }
}
