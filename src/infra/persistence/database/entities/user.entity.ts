import { BaseEntity } from '@commons/general/entities';
import { Column, Entity } from 'typeorm';

export enum EUserType {
  RECEIVER = 'receiver',
  SENDER = 'sender',
  BOTH = 'both',
}

export enum EUserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', name: 'cpf', unique: true })
  cpf: string;

  @Column({ type: 'float', name: 'balance' })
  balance: number;

  @Column({ type: 'varchar', name: 'type' })
  type: EUserType;

  @Column({ type: 'varchar', name: 'role', default: EUserRole.USER })
  role: EUserRole;
}