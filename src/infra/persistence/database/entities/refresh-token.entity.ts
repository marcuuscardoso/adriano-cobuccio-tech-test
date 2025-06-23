import { BaseEntity } from '@commons/general/entities';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @Column({ type: 'text', name: 'token' })
  token: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'varchar', name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ type: 'boolean', name: 'is_revoked', default: false })
  isRevoked: boolean;
}