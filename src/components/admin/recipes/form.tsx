'use client';

import { useToast } from '@/hooks/use-toast';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createIngredientOption,
  createSchema,
  createSubmitRecipe,
  deleteRecipe,
  editSubmitRecipe,
  loadIngredientOptions,
  onChangeIngredients,
} from '@/utils/recipes/form.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CategoryRecipeType,
  Ingredient,
  Recipe,
  RecipeType,
} from '@prisma/client';
import { useCallback } from 'react';
import debounce from '@/utils/debounce';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteRecipe from '@/components/admin/recipes/deleteRecipe';

type RecipeFormProps = {
  recipe?: Recipe;
};

const RecipeForm = ({ recipe }: RecipeFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: !recipe
      ? {
          title: '',
          description: '',
          category: CategoryRecipeType.VEGETARIAN,
          type: RecipeType.ENTREE,
          ingredients: [],
        }
      : recipe,
  });

  const loadIngredientOptionsDebounced = useCallback(
    debounce(
      (inputValue: string, callback: (options: Ingredient[]) => void) => {
        loadIngredientOptions(inputValue).then((options) => callback(options));
      },
      500
    ),
    []
  );

  const onUpsertMutation = useMutation({
    mutationFn: recipe ? editSubmitRecipe : createSubmitRecipe,
    onSuccess: () => {
      toast({
        variant: 'success',
        description: `Recipe ${recipe ? 'edited' : 'created'} successfully.`,
      });
      router.push('..');
      router.refresh();
    },
    onError: () =>
      toast({
        variant: 'destructive',
        description: 'An error occurred please try again',
      }),
  });

  const onDeleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      toast({
        variant: 'success',
        description: `Recipe successfully deleted.`,
      });
      router.push('..');
      router.refresh();
    },
    onError: () =>
      toast({
        variant: 'destructive',
        description: 'An error occurred please try again',
      }),
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'ingredients',
    keyName: 'customId',
  });

  const onSubmit = (values: z.infer<typeof createSchema>) => {
    onUpsertMutation.mutate(values);
  };

  return (
    <div className="flex flex-col w-full">
      <Link href=".." className="self-end m-4">
        <Button size="lg" variant="secondary">
          Back
        </Button>
      </Link>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 w-1/2 m-auto p-4 border border-secondary shadow-md rounded"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex justify-between">
            <h3 className="mb-2">{recipe ? 'Edit' : 'Create'} a recipe</h3>
            {recipe && (
              <DeleteRecipe
                recipeId={recipe.id}
                onDeleteMutation={onDeleteMutation}
              ></DeleteRecipe>
            )}
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light">Title</FormLabel>
                <Input
                  required
                  id="title"
                  placeholder="Title of the recipe"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light">
                  Description
                </FormLabel>
                <Textarea
                  rows={6}
                  required
                  placeholder="Description of the recipe"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Recipe category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.keys(CategoryRecipeType) as Array<
                        keyof typeof CategoryRecipeType
                      >
                    ).map((value) => (
                      <SelectItem
                        className="capitalize"
                        key={value}
                        value={value}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Recipe type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.keys(RecipeType) as Array<keyof typeof RecipeType>
                    ).map((value) => (
                      <SelectItem
                        className="capitalize"
                        key={value}
                        value={value}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-light">
                  Ingredients of your recipes
                </FormLabel>
                <AsyncCreatableSelect
                  instanceId="select-ingredients"
                  isClearable={true}
                  isMulti={true}
                  placeholder="Select or create ingredients"
                  loadOptions={loadIngredientOptionsDebounced}
                  onCreateOption={(inputValue) =>
                    createIngredientOption(inputValue, append)
                  }
                  getOptionLabel={(option) =>
                    option.id === 0 ? `Create: ${option.name}` : option.name
                  }
                  getOptionValue={(option) => option.id.toString()}
                  getNewOptionData={(inputValue) => ({
                    id: 0,
                    name: inputValue,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })}
                  defaultOptions={true}
                  onChange={(_, actionType) =>
                    onChangeIngredients(actionType, { remove, append, fields })
                  }
                  value={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={onUpsertMutation.isPending || onDeleteMutation.isPending}
            type="submit"
          >
            {onUpsertMutation.isPending && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RecipeForm;
