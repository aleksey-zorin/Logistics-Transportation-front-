export interface Order {
  id: number,
  userId: string,
  pickAppAddress: string,
  deliveryAddress: string,
  description: string,
  cargoWeight: number,
  cargoVolume: number,
  registrationDateOrder: string
}