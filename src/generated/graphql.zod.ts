import * as z from 'zod'

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export const CacheControlScopeSchema = z.enum(CacheControlScope);

export const CollectionSubtypeSchema = z.enum(CollectionSubtype);

export const LinkTypeSchema = z.enum(LinkType);

export const ThingTypeSchema = z.enum(ThingType);

export function CollectionFiltersInputSchema(): z.ZodObject<Properties<CollectionFiltersInput>> {
  return z.object({
    subtype: CollectionSubtypeSchema.nullish()
  })
}

export function PlayFiltersInputSchema(): z.ZodObject<Properties<PlayFiltersInput>> {
  return z.object({
    id: z.string().nullish(),
    maxdate: z.string().nullish(),
    mindate: z.string().nullish(),
    page: z.number().default(1).nullish()
  })
}

export function SearchInputSchema(): z.ZodObject<Properties<SearchInput>> {
  return z.object({
    exact: z.boolean().default(false).nullish(),
    query: z.string(),
    type: ThingTypeSchema.nullish()
  })
}
