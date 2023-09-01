import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { ClientEntity } from '../../client/entities/client.entity'
import { ICar } from '../../interfaces/car.interface'
import { BaseEntity } from '../../shared/entities/base.entity'
import { RegisterEntity } from '../../register/entities/register.entity'

@Entity({ name: 'cars' })
export class CarEntity extends BaseEntity implements ICar {
  @Column({ unique: true })
  vin: string

  @Column()
  brand: string

  @Column()
  model: string

  @Column({ nullable: true })
  color: string

  @Column()
  licensePlate: string

  @Column({ nullable: true })
  image: string

  @Column()
  year: string

  @Column({ nullable: true, default: 0 })
  lastChecked: string

  @Column({ type: 'timestamp', default: () => 'NULL' })
  repairDate: Date

  @ManyToOne(() => ClientEntity, (client) => client.cars, {
    onDelete: 'CASCADE',
  })
  client: ClientEntity

  @OneToMany(() => RegisterEntity, (registers) => registers.car, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  registers: RegisterEntity[]
}
