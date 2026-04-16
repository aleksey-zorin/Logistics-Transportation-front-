import { licenceCategories } from "../licenceCategory/licenceCategory.struct"

export interface Car {
    id: number,
    carMake: string,
    carModel: string,
    typeOfCar: string,
    carNumber: string,
    cargoCapacityT: number,
    trunkVolumeL: number,
    fuelConsumption: number,
    licenceCategories: licenceCategories 
}