import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Nav from '../Nav/Nav';
import Landing from '../../routes/Landing/Landing';
import Footer from '../Footer/Footer';
import RecipeList from '../../routes/RecipeList/RecipeList';
import RecipeDetail from '../../routes/RecipeDetail/RecipeDetail';
import CreateRecipe from '../../routes/CreateRecipe/CreateRecipe';
import SignIn from '../../routes/SignIn/SignIn';
import SignUp from '../../routes/SignUp/SignUp';
import OnlyTastefulContext from '../../context/OnlyTastefulContext';
import RecipesApiService from '../../services/recipes-api-service';
import './App.css';

// TODO: Add form validation for signin
// TODO: Add form validation for signup
// TODO: Add form validation for create recipe
// TODO: Add error boundary and tests

/* ---- NOTES ----
  * When user signed in show buttons for delete and modify on their own recipes, will need auth for this
*/

class App extends Component {
  state = {
    recipes: [],
    currentUser: false,
  }

  componentDidMount() {
    RecipesApiService.getRecipes()
      .then(res => this.setState({
        recipes: res,
      }))
  }

  handleSignIn = (user_name) => {
    this.setState({
      currentUser: user_name,
    })
  }

  handleSignOut = () => {
    this.setState({
      currentUser: false,
    })
  }

  handleCreateRecipe = (newRecipe) => {
    this.setState({
      recipes: [ ...this.state.recipes, newRecipe ]
    })
  }

  handleDeleteRecipe = (recipe_id) => {
    this.setState({
      recipes: this.state.recipes.filter(item => item.id !== parseInt(recipe_id))
    })
  }

  render() {
    const value = {
      recipes: this.state.recipes,
      currentUser: this.state.currentUser,
      signIn: this.handleSignIn,
      signOut: this.handleSignOut,
      createRecipe: this.handleCreateRecipe,
      addRecipe: this.handleCreateRecipe,
      deleteRecipe: this.handleDeleteRecipe
    }
    return (
      <OnlyTastefulContext.Provider value={value}>
        <div className="App">
          <Nav />
          <Route exact path='/' component={Landing} />
          <Route path='/signup' component={SignUp} />
          <Route path='/signin' component={SignIn} />
          <Route exact path='/recipes' component={RecipeList} />
          <Route path='/recipes/:recipeId' component={RecipeDetail} />
          <Route path='/createrecipe' component={CreateRecipe} />
          <Footer />
        </div>
      </OnlyTastefulContext.Provider>
    )
  };
}

export default App;
