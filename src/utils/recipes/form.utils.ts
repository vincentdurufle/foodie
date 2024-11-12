import {
  CategoryRecipeType,
  Ingredient,
  Recipe,
  RecipeType,
} from '@prisma/client';
import { array, nativeEnum, number, object, string, z } from 'zod';
import { ActionMeta } from 'react-select';
import axios from 'axios';
import { UseFieldArrayRemove } from 'react-hook-form';

const createSchema = object({
  id: number().optional(),
  title: string({ required_error: 'Title is required' }).min(
    3,
    'Title must be more than 3 letters'
  ),
  description: string({ required_error: 'Description is required' }).min(
    3,
    'Description must be more than 3 letters'
  ),
  category: nativeEnum(CategoryRecipeType),
  type: nativeEnum(RecipeType),
  ingredients: array(
    object({
      name: string(),
      id: number(),
    })
  ).nonempty(),
});

const loadIngredientOptions = async (
  inputValue: string
): Promise<Ingredient[]> => {
  const response = await axios.get<Ingredient[]>(`/api/ingredients/search/`, {
    params: {
      query: inputValue.trim(),
    },
  });

  return response.data;
};

const createIngredientOption = async (
  inputValue: string,
  append: (value: Ingredient) => void
) => {
  const response = await axios.post<Ingredient>('/api/ingredients', {
    body: {
      name: inputValue,
    },
  });

  append(response.data);

  return response.data;
};

const onChangeIngredients = (
  actionType: ActionMeta<Ingredient>,
  helpers: {
    remove: UseFieldArrayRemove;
    append: (value: Ingredient | Ingredient[]) => void;
    fields: Ingredient[];
  }
) => {
  switch (actionType.action) {
    case 'clear':
      return helpers.remove();
    case 'select-option':
      if (actionType.option) {
        return helpers.append(actionType.option);
      }
      break;
    case 'remove-value':
      return helpers.remove(
        helpers.fields.findIndex(
          (field) => field.id === actionType.removedValue.id
        )
      );
  }
};

const onCreateSubmitRecipe = (values: z.infer<typeof createSchema>) => {
  return axios.post<Recipe>(`/api/recipes`, values, {});
};

const onEditSubmitRecipe = (values: z.infer<typeof createSchema>) => {
  return axios.put<Recipe>(`/api/recipes/${values.id}`, values, {});
};

export {
  loadIngredientOptions,
  createIngredientOption,
  onChangeIngredients,
  createSchema,
  onCreateSubmitRecipe,
  onEditSubmitRecipe,
};
