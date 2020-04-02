import React, { Component } from 'react';
import RecipeContext from '../../context/RecipesContext';
import RecipesApiService from '../../services/recipes-api-service';
import './RecipeDetail.css';

// TODO: Get update working with context
// TODO: Get delete working with context

class RecipeDetail extends Component {

  componentDidMount() {
    const { recipeId } = this.props.match.params;
    RecipesApiService.getRecipeDetails(recipeId)
      .then(res => {
        this.context.setRecipe(res.recipe)
        this.context.setIngredients(res.ingredients)
      })
      .catch(err => this.context.setError(err))
  }

  static contextType = RecipeContext;

  static defaultProps = {
    match: {
      params: {}
    },
    history: {
      push: () => { }
    },
    users: [
      { id: 1 }
    ]
  }

  updateRecipe = () => {
    const { recipeId } = this.props.match.params;
    this.props.history.push(`/recipes/${recipeId}/update`)
  }

  deleteRecipe = () => {
    const { recipeId } = this.props.match.params;
    RecipesApiService.deleteRecipe(recipeId)
      .then(this.context.deleteRecipe(recipeId))
      .then(this.props.history.push('/recipes'))
      .catch(err => console.log(err))
  }

  render() {
    const ingredients = this.context.recipeDetails.ingredients.map((ingredient, idx) =>
      <li key={idx}>{ingredient.quantity} {ingredient.measurement} {ingredient.ingredient_name}</li>
    )
    const recipe = this.context.recipeDetails.recipe
    return (
      <main className='RecipeDetail'>
        <header>
          <h2>{recipe.title}</h2>
          <p>Added by: {recipe.user_name}</p>
        </header>
        <section className="description">
          <p>
            {recipe.recipe_description}
          </p>
        </section>
        <section>
          <h3>Ingredients List</h3>
          <ul>
            {ingredients}
          </ul>
        </section>
        <section>
          <h3>Cooking Instructions</h3>
          <p>
            {recipe.instructions}
          </p>
        </section>
        {recipe.user_name === this.context.currentUser
          ? <>
            <button type='button' className='updateRecipe'
              onClick={this.updateRecipe}>Update Recipe</button>
            <button type='button' className='deleteRecipe'
              onClick={this.deleteRecipe}>Delete Recipe</button>
          </>
          : null
        }
      </main>
    )
  }
}

export default RecipeDetail;