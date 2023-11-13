import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommodityModel1699833243522 implements MigrationInterface {
  name = 'AddCommodityModel1699833243522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commodities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_41fb26709d58c5dc3d4aa8f5b69" UNIQUE ("name"), CONSTRAINT "PK_d8ec0122a7596e8b1b0a275c9c0" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "commodities"`);
  }
}
