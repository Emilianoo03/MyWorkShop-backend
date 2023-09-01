import { Column, Entity, OneToMany } from 'typeorm'
import { CarEntity } from '../../car/entities/car.entity'
import { IClient } from '../../interfaces/client.interface'
import { BaseEntity } from '../../shared/entities/base.entity'

@Entity({ name: 'clients' })
class ClientEntity extends BaseEntity implements IClient {
  @Column({ unique: true })
  clientCI: string

  @Column()
  fullName: string

  @Column()
  phoneNumber: string

  @Column()
  address: string

  @OneToMany(() => CarEntity, car => car.client, { cascade: true, onDelete: 'CASCADE' })
  cars: CarEntity[]
}

export { ClientEntity }

