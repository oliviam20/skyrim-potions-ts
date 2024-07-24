import { useState, useMemo, useCallback } from 'react'
import ingredientsData from "./data.json";

const data: {
  id: number;
  name: string;
  effects: string[];
}[] = ingredientsData.ingredients;
const allEffects = data.flatMap((e) => e.effects);
const uniqueEffects: string[] = [...new Set(allEffects)];
uniqueEffects.sort();

function App() {
  const [value, setValue] = useState("");
  // const [suggestions, setSuggestions] = useState(uniqueEffects);

  const getSuggestions = useCallback((value: string) => {
    const inputValue = value.trim().toLowerCase();

    const filteredIngredientsList = data.filter((e) => {
      // const filteredEffects = e.effects.filter((effects) => {
      //   return effects.toLowerCase().trim().includes(inputValue);
      // });
      return e.effects.some((effects) => {
        return effects.toLowerCase().trim().includes(inputValue);
      });
      // return filteredEffects.length > 0 && e;
    });

    // sort list in alphabetical order
    filteredIngredientsList.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    // if input is effect, return ingredient list
    if (uniqueEffects.some((effect) => effect.toLowerCase().includes(inputValue))) {
      return filteredIngredientsList;
    }

    // if input is ingredient, return effects list for that ingredient
    const ingredientName = data.find(
      (e) => e.name.toLowerCase().includes(inputValue)
    );
    if (ingredientName) {
      return ingredientName.effects.map((effect) => ({ name: effect }));
    }

    // default rendered list
    return uniqueEffects.map((effect) => ({ name: effect }));
  }, [])

  const suggestions = useMemo(() => getSuggestions(value), [value, getSuggestions]);

  console.log('suggestions', suggestions)

  return (
    <div className="flex p-4 justify-center">
      <div className="max-w-lg flex flex-col gap-2 p-2">
        <p>
          Click or type in the ingredient or effect you want to craft (e.g. Restore
          Health, Blue Mountain Flower):
        </p>
        <input onChange={(e) => setValue(e.target.value)} value={value} type="text" className="border border-gray-700 rounded-md w-64" />
        <div className="p-2">
          {suggestions.map((suggestion, index) => {
            return (
              <div key={index} onClick={() => setValue(suggestion.name)}>
                <button className="cursor-pointer">{suggestion.name}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default App
