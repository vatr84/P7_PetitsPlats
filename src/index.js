import { recipes } from './data/recipes.js'
import { creerFiltres } from './components/filters.js'
import { rechercheInput } from './components/searchInput.js'
import { rechercherRecettesParMotsCles, rechercherRecettesParTexte } from './components/searchAlgo.js'
import { creerRecette } from './components/recipeTemplate.js'

export const filterType = {
  TXT: 'text',
  KEYWORDS: 'keywords'
}

const app = (initRecipes) => {
  const noRecipe = !initRecipes || initRecipes.length === 0

  if (noRecipe) {
    console.error('No recipes found')
    return
  }

  const state = {
    inputText: {},
    inputFilters: {},
    recipes: initRecipes
  }

  const init = () => {
    const recipes = state.recipes

    updateRecipeCounter(recipes.length)
    updateRecipesList(recipes)
    state.inputText = rechercheInput()
    state.inputFilters = creerFiltres(recipes)

    document.addEventListener('searchRecipes', onSearch)
  }

  const onSearch = ({ detail }) => {
    const { type } = detail

    state.recipes = search(type)
    updateRecipesList()
    updateRecipeCounter()
    updateFilters()
  }

  const search = (type) => {
    let list = initRecipes
    const { inputText, inputFilters } = state

    const isSomeFiltersSelected = Object.keys(inputFilters).some((key) => {
      return inputFilters[key].state.value.length !== 0
    })
    const isTextSearch = inputText.value.length >= 3

    if (!isTextSearch && !isSomeFiltersSelected) {
      return list
    }

    if (type === filterType.TXT) {
      if (isSomeFiltersSelected) {
        list = rechercherRecettesParMotsCles(inputFilters, list)
      }

      list = rechercherRecettesParTexte(inputText.value, list)
    }

    if (type === filterType.KEYWORDS) {
      if (isTextSearch) {
        list = rechercherRecettesParTexte(inputText.value, list)
      }

      list = rechercherRecettesParMotsCles(inputFilters, list)
    }

    return list
  }

  const updateFilters = () => {
    const filters = Object.keys(state.inputFilters)

    filters.forEach((key) => {
      return state.inputFilters[key].updateOptions(state.recipes)
    })
  }

  const updateRecipesList = () => {
    const recipesContainer = document.getElementById('recipes')
    const messageContainer = document.getElementById('message')
    const { recipes, inputText } = state

    if (recipes.length === 0) {
      if (inputText.value.length >= 3) {
        messageContainer.querySelector('strong').innerText =
          state.inputText.value
      }

      messageContainer.classList.remove('hidden')
      recipesContainer.innerHTML = ''

      return
    }

    if (!messageContainer.classList.contains('hidden')) {
      messageContainer.classList.add('hidden')
    }

    recipesContainer.innerHTML = recipes
      .map((recipe) => {
        return creerRecette(recipe).getHTML()
      })
      .join('')
  }

  const updateRecipeCounter = () => {
    const counter = document.getElementById('recipes-counter')
    const total = state.recipes.length
    counter.innerText = `${total} ${total > 1 ? 'recettes' : 'recette'}`
  }

  return {
    init
  }
}

app(recipes).init()
