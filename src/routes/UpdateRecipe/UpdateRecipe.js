import React, { Component } from 'react';
import IngredientInput from '../../components/IngredientInput/IngredientInput';
import OnlyTastefulContext from '../../context/OnlyTastefulContext';
import RecipesApiService from '../../services/recipes-api-service';
import './UpdateRecipe.css';

export default class UpdateRecipe extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  state = {
    recipe: {
      title: {
        value: '',
        touched: false,
      },
      recipe_description: {
        value: '',
        touched: false,
      },
      instructions: {
        value: '',
        touched: false,
      }
    },
    ingredients: {
      values: [
        {
          quantity: '',
          measurement_name: '',
          ingredient_name: '',
        },
      ],
      touched: false,
    },
  }

  componentDidMount() {
    const { recipeId } = this.props.match.params;
    RecipesApiService.getRecipeDetails(recipeId)
      .then(res => this.setState({
        recipe: {
          title: {
            value: res.recipe.title,
            touched: false,
          },
          recipe_description: {
            value: res.recipe.recipe_description,
            touched: false,
          },
          instructions: {
            value: res.recipe.instructions,
            touched: false,
          },
        },
        ingredients: {
          values: res.ingredients
        }
      }))
      .catch(err => console.log(err))
  }

  static contextType = OnlyTastefulContext;

  updateTitle(value) {
    const recipe = this.state.recipe
    this.setState({
      recipe: {
        title: {
          value: value,
          touched: true
        },
        recipe_description: recipe.recipe_description,
        instructions: recipe.instructions
      },
    })
  }

  updateDescription(value) {
    const recipe = this.state.recipe
    this.setState({
      recipe: {
        title: recipe.title,
        recipe_description: {
          value: value,
          touched: true
        },
        instructions: recipe.instructions,
      },
    })
  }

  updateInstructions(value) {
    const recipe = this.state.recipe
    this.setState({
      recipe: {
        title: recipe.title,
        recipe_description: recipe.recipe_description,
        instructions: {
          value: value,
          touched: true
        },
      },
    })
  }

  updateIngredients = (target, idx) => {
    const ingredientValues = this.state.ingredients.values;
    if (target.id === `ingredient_name${idx}`) {
      this.setState({
        ingredients: {
          values: [
            ...ingredientValues.slice(0, idx),
            {
              ingredient_name: target.value,
              measurement_name: ingredientValues[idx].measurement_name,
              quantity: ingredientValues[idx].quantity,
            },
            ...ingredientValues.slice(idx + 1)
          ],
          touched: true
        }
      })
    } else if (target.id === `measurement_name${idx}`) {
      this.setState({
        ingredients: {
          values: [
            ...ingredientValues.slice(0, idx),
            {
              ingredient_name: ingredientValues[idx].ingredient_name,
              measurement_name: target.value,
              quantity: ingredientValues[idx].quantity,
            },
            ...ingredientValues.slice(idx + 1)
          ],
          touched: true
        }
      })
    } else if (target.id === `ingredient_quantity${idx}`) {
      this.setState({
        ingredients: {
          values: [
            ...ingredientValues.slice(0, idx),
            {
              ingredient_name: ingredientValues[idx].ingredient_name,
              measurement_name: ingredientValues[idx].measurement_name,
              quantity: target.value,
            },
            ...ingredientValues.slice(idx + 1)
          ],
          touched: true
        }
      })
    }
  }

  addIngredient = (e) => {
    e.preventDefault()
    this.setState({
      ingredients: {
        values: [
          ...this.state.ingredients.values,
          {
            quantity: '',
            measurement_name: '',
            ingredient_name: ''
          },
        ],
      },
    })
  }

  removeIngredients = (index) => {
    const ingredients = this.state.ingredients.values
    this.setState({
      ingredients: {
        values: [
          ...ingredients.slice(0, index),
          ...ingredients.slice(index + 1)
        ]
      }
    })
  }

  onUpdateRecipe = (e) => {
    e.preventDefault()
    const { recipeId } = this.props.match.params;
    const recipe = this.state.recipe
    const updatedRecipe = {
      title: recipe.title.value,
      recipe_description: recipe.recipe_description.value,
      instructions: recipe.instructions.value,
      ingredients: this.state.ingredients.values,
    }
    RecipesApiService.updateRecipe(updatedRecipe, recipeId)
      .then(this.context.updateRecipe)
      .catch()
    this.props.history.push(`/recipes/${recipeId}/`)
  }


  render() {
    return (
      <main role="main" className='updateRecipe'>
        <header>
          <h2>Update Recipe</h2>
        </header>
        <section>
          <form className='updateRecipeForm' onSubmit={this.onUpdateRecipe}>
            <div className='flexContainer'>
              <div className='leftColumn'>
                <label htmlFor='recipe_title'>Title</label>
                <input
                  type='text' name='title' id='recipe_title'
                  defaultValue={this.state.recipe.title.value}
                  onChange={e => this.updateTitle(e.target.value)}
                />
                <label htmlFor='description'>Description</label>
                <textarea
                  name='recipe_description' id='recipe_description'
                  defaultValue={this.state.recipe.recipe_description.value}
                  onChange={e => this.updateDescription(e.target.value)}
                />
                <label htmlFor='instructions'>Cooking Directions</label>
                <textarea
                  id='instructions' name='instructions'
                  defaultValue={this.state.recipe.instructions.value}
                  onChange={e => this.updateInstructions(e.target.value)}
                ></textarea>
              </div>
              <div className='rightColumn'>
                {this.state.ingredients.values.map((ingredient, idx) =>
                  <IngredientInput key={idx} idx={idx}
                    data={ingredient} arrLength={this.state.ingredients.values.length}
                    handleChange={this.updateIngredients} onClick={e => this.removeIngredients(idx)}
                  />
                )}
                <button onClick={this.addIngredient}>+ Add another ingredient</button>
              </div>
            </div>
            <input type='submit' />
          </form>
        </section>
      </main>
    )
  }
}