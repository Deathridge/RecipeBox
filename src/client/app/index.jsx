import React from 'react';
import {render} from 'react-dom';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
require('../../stylesheets/main.scss');

var Ingredient = React.createClass ({
	render: function (){
		return (
			<div className="row" key={this.props.ingredient}>
				<p>{this.props.ingredient}</p>
			</div>
		);
	}
});

var Recipe = React.createClass ({
	
	render: function() {
		var ingredientNodes = this.props.recipe.map(function(ingredient){
			return (
				<div className="recipeIngredient" key={ingredient.name}>
					<Ingredient ingredient={ingredient.name} ></Ingredient>
				
				</div>
			);
		});

		return (			
			
			<div className="rowList">						
				{ingredientNodes}
			</div>
			
		);
	}
})

var RecipeAdd = React.createClass ({
  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });    
  },
  save: function() {
  	this.props.saveForm();
	this.close();
  },

  edit: function(recipe) {
  	this.open();  	  	
  	this.props.editRecipe(recipe);  	
  },

  render() {  	

  	var sortedData = this.props.data.sort(function(previous, next){
	  		if(previous.id < next.id){
	  			return -1;
	  		}else if(previous.id > next.id){
	  			return 1;
	  		}else{
	  			return 0;
	  		}
	  	});

  	var recipeNodes = sortedData.map(function(recipe){
			return (				
				<div className="recipeContainer panel panel-default" key={recipe.id}>
					<div class="panel-heading">
						<h1 class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion" href={"#" + recipe.id}>{recipe.name}</a>
						</h1>
					</div>
					<div id={recipe.id} className="panel-collapse collapse">
						<div class="panel-body">
							
							<Recipe recipe={recipe.ingredients} ></Recipe>
							<div className="buttonContainer" >
								<Button className="deleteButton" onClick={this.props.deleteRecipe.bind(null, recipe)} >Delete</Button>
								<Button id="editButton" className="editButton" onClick={this.edit.bind(null, recipe)}>Edit</Button>
							</div>
							
						</div>
					</div>
				</div>
			);
		}.bind(this));

    return (

    <div>
      <div>
      {recipeNodes}
      </div>
      <div className="recipeAdd">
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.open}
        >
          Add Recipe
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          	<input id="recipeName" placeholder="Enter recipe name" defaultValue={this.props.recipeName}></input>
          	<input id="recipeIngredients" placeholder="Ingredients" defaultValue={this.props.recipeIngredients}></input>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button onClick={this.save}>Save Recipe</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
    );
   }
});


var RecipeList = React.createClass ({
	
	getInitialState: function() {
		$('.collapse').collapse("hide");
		return JSON.parse(localStorage.getItem('recipeList') || '{"data":[]}')		
		
	},
	componentDidMount: function(){
		var result = [{
		"id": "1",
        "name": "Crock Pot Roast",
        "ingredients": [
            {
                "name": " beef roast",               
            },
            {                
                "name": "brown gravy mix",                
            },
            {                
                "name": "dried Italian salad dressing mix",                
            },
            {                
                "name": "dry ranch dressing mix",                
            },
            {                
                "name": "water",                
            }
        ]},
        {
        "id" : "2",
        "name": "Roasted Asparagus",
        "ingredients": [
            {
                "quantity": "1 lb",
                "name": " asparagus",
                "type": "Produce"
            },
            {
                "quantity": "1 1/2 tbsp",
                "name": "olive oil",
                "type": "Condiments"
            },
            {
                "quantity": "1/2 tsp",
                "name": "kosher salt",
                "type": "Baking"
            }
        ]},
        
	    {
	    	"id": "3",
	        "name": "Curried Lentils and Rice",
	        "ingredients": [
	            {
	                "quantity": "1 quart",
	                "name": "beef broth",
	                "type": "Misc"
	            },
	            {
	                "quantity": "1 cup",
	                "name": "dried green lentils",
	                "type": "Misc"
	            },
	            {
	                "quantity": "1/2 cup",
	                "name": "basmati rice",
	                "type": "Misc"
	            },
	            {
	                "quantity": "1 tsp",
	                "name": "curry powder",
	                "type": "Condiments"
	            },
	            {
	                "quantity": "1 tsp",
	                "name": "salt",
	                "type": "Condiments"
	            }
	        ]
	    }];        
        
		if(JSON.parse(localStorage.getItem('recipeList'))){
			this.setState({
				data: JSON.parse(localStorage.getItem('recipeList')).data
			});		
		}else{
			this.setState({
				data: result
			})
		}	
		
		
	},
	componentDidUpdate: function(prevProps, prevState){
		localStorage.setItem('recipeList', JSON.stringify(this.state));
	},

	deleteRecipe: function(recipe){
		var newArray = this.state.data.filter(function(current){
			if(current.name != recipe.name){
				return current;
			}
		}.bind(this));
		
		this.setState({
			data: newArray
		});			
	},
	editRecipe: function(recipe){		
		var recipeID = "";
		var recipeName = "";
		var recipeIngredients = "";
		recipeID = recipe.id;
		recipeName = recipe.name;		
		recipe.ingredients.forEach(function(currentItem){
			recipeIngredients += currentItem.name + ",";
		});

		this.setState({
			recipeID: recipeID,
			recipeName: recipeName,
			recipeIngredients: recipeIngredients
		});
		
	},
	recipeExists(recipeName,data){
		data.map(function(currentRecipe){
			if(currentRecipe.name == recipeName){
				return true;
			}
		});
		return false;
	},
	save (){
		
	  	var newIngredients = document.getElementById('recipeIngredients').value.split(',');
	  	var recipeName = document.getElementById('recipeName').value;	

	  	if(!this.recipeExists(recipeName, this.state.data)){
	  		var newData = [];
		  	var ingredientList = newIngredients.map(function(eachIngredient){
	  			return {'name': eachIngredient};
			});
			var maxID = 0;
			this.state.data.map(function(current){
				if (current.id > maxID){
					maxID = current.id;
				}
			});
			var recipeID = parseInt(maxID) + 1 + "";
			
			var updateRecipe = {'id': recipeID,'name': recipeName , 'ingredients': []};
			ingredientList.forEach(function(currentIngredient){
				updateRecipe.ingredients.push(currentIngredient);
			});
			newData.push(updateRecipe);
	  	}else{
	  		var newData = [];
	  	}
	  	

  		this.state.data.forEach(function(findRecipe){
  			if(findRecipe.name != recipeName){
  				newData.push(findRecipe);
  			}else{
  				var newArray = newData.filter(function(current){
					if(current.name != recipeName){
						return current;
					}
				});  				
  				var ingredients = newIngredients.map(function(eachIngredient){
  					return {'name': eachIngredient};
  				});
  				findRecipe.ingredients = ingredients;
  				 			
  				newArray.push(findRecipe);
  				newData = newArray;  					
  			}  			

  		}.bind(this));
  		
  		
	  	this.setState({
	  		data: newData
	  	});
	  	
	},
	
	render: function() {		
		
		return (
			<div>			
				<div className="RecipeList panel-group" id="accordion">
					<RecipeAdd data={this.state.data} deleteRecipe={this.deleteRecipe} editRecipe={this.editRecipe} saveForm={this.save} recipeName={this.state.recipeName} recipeIngredients={this.state.recipeIngredients}/>
				</div>			
			</div>
		);		
	}
});



render(<RecipeList/>, document.getElementById('app') );

