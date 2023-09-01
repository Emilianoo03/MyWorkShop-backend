import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";
import { CarEntity } from "../../car/entities/car.entity";


@Entity({ name: 'registers' })
export class RegisterEntity extends BaseEntity {
  @Column()
  repairName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  repairDate: Date;

  @Column({ type: 'float', nullable: true, default: 0 })
  mileage: number;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true, default: "" })
  notes: string;

  @ManyToOne(() => CarEntity, car => car.registers, { onDelete: 'CASCADE' })
  car: CarEntity;
}
