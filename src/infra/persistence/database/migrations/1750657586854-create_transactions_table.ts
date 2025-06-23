import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionsTable1750657586854 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'amount',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['transfer', 'reversal'],
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['pending', 'completed', 'failed', 'reversed'],
                        isNullable: false,
                        default: `'pending'::"transactions_status_enum"`,
                    },
                    {
                        name: 'sender_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'receiver_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'original_transaction_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reversed_transaction_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'updated_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['sender_id'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['receiver_id'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['original_transaction_id'],
                        referencedTableName: 'transactions',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                    {
                        columnNames: ['reversed_transaction_id'],
                        referencedTableName: 'transactions',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                ],
                indices: [
                    {
                        name: 'IDX_TRANSACTIONS_SENDER_ID',
                        columnNames: ['sender_id'],
                    },
                    {
                        name: 'IDX_TRANSACTIONS_RECEIVER_ID',
                        columnNames: ['receiver_id'],
                    },
                    {
                        name: 'IDX_TRANSACTIONS_STATUS',
                        columnNames: ['status'],
                    },
                    {
                        name: 'IDX_TRANSACTIONS_TYPE',
                        columnNames: ['type'],
                    },
                    {
                        name: 'IDX_TRANSACTIONS_CREATED_AT',
                        columnNames: ['created_at'],
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions');
    }
}
