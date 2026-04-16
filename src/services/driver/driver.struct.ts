import { licenceCategories } from "../licenceCategory/licenceCategory.struct"

export interface Driver {
    id: number,
    name: string,
    passport: string,
    age: number,
    rate: number,
    licenceCategories: licenceCategories
}