import React from 'react';
import './IngredientInput.css';

export default function IngredientInput(props) {
  return (
    <div key={props.idx} className='IngredientInput' onChange={(e) => props.handleChange(e.target, props.idx)}>
      <p>Ingredient {props.idx + 1}</p>
      <label htmlFor={`ingredient${props.idx}`}>Name</label>
      <input type='text' name={`ingredient_name${props.idx}`} id={`ingredient_name${props.idx}`} defaultValue={props.data.name}/>
      <label htmlFor={`ingredient${props.idx}`}>Quantity</label>
      <input type='text' name={`ingredient_quantity${props.idx}`} id={`ingredient_quantity${props.idx}`} defaultValue={props.data.quantity}/>
      <label htmlFor={`ingredient${props.idx}`}>Unit</label>
      <input type='text' name={`ingredient_unit${props.idx}`} id={`ingredient_unit${props.idx}`} defaultValue={props.data.unit} />
      { props.arrLength > 1 ? 
        <button type="button"
          onClick={(e) => props.onClick(e)}
        >Remove Ingredient</button>
      : null }
    </div>
  )
}

IngredientInput.defaultProps = {
  idx: 1,
  data: {
    name: '',
    quantity: '',
    unit: '',
  },
}