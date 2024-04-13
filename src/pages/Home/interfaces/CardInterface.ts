import { CategoriesInterface } from "./CategoriesInterface"

export type CardInterface = {
    id: string,
    description: string,
    status:string,
    title: string,
    categories:CategoriesInterface[]
}