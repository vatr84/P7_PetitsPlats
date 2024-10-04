/**
 * Crée un objet recette avec les propriétés fournies.
 * @param {Object} recipeData - Les données de la recette.
 * @param {string} recipeData.id - L'ID de la recette.
 * @param {string} recipeData.image - L'URL de l'image de la recette.
 * @param {string} recipeData.name - Le nom de la recette.
 * @param {number} recipeData.servings - Le nombre de portions pour la recette.
 * @param {Array} recipeData.ingredients - La liste des ingrédients pour la recette.
 * @param {number} recipeData.time - Le temps de cuisson en minutes pour la recette.
 * @param {string} recipeData.description - La description de la recette.
 * @param {string} recipeData.appliance - L'appareil requis pour la recette.
 * @param {Array} recipeData.ustensils - La liste des ustensiles requis pour la recette.
 * @returns {Object} - L'objet recette.
 */
export const creerRecette = ({
  id,
  image,
  name,
  servings,
  ingredients,
  time,
  description,
  appliance,
  ustensils
}) => {
  const obtenirIngredientsHTML = () => {
    return ingredients
      .map(({ ingredient, quantity, unit }) => {
        return `
          <div>
            <dt>${ingredient}</dt>
            <dd>${quantity || ''} ${unit || ''}</dd>
          </div>`
      })
      .join('')
  }

  const getHTML = () => {
    return `
      <article class="w-full bg-white rounded-lg md:max-w-380">
        <div class="relative">
          <img
            src="./assets/images/recipes/${image}"
            alt="Photo de la recette"
            class="w-full rounded-t-lg object-cover h-64"
          />
          <span
            class="absolute top-5 right-5 z-0 rounded-md bg-yellow px-4 py-1.5 text-xs"
            >${time}min</span
          >
        </div>
        <div class="px-6 py-8">
          <h3 class="text-xl font-heavy">${name}</h3>
          <div class="mt-9">
            <h4 class="uppercase text-md text-gray">recette</h4>
            <p class="mt-4">
              ${description}
            </p>
          </div>
          <div class="mt-9">
            <h5 class="uppercase text-md text-gray">ingrédient</h5>
            <div class="grid grid-cols-2 my-4 gap-y-5 gap-x-20">${obtenirIngredientsHTML()}</div>
          </div>
        </div>
      </article>
    `
  }

  return {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getHTML
  }
}
