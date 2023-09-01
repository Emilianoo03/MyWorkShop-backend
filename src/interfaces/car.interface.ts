import { IClient } from "./client.interface"

export interface ICar {
    licensePlate: string
    image: string
    brand: string
    model: string
    vin: string
    year: string
    lastChecked: string
    checkedTimes: string
    client: IClient
}
