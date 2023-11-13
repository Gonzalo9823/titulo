import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVarietyModel1699833298479 implements MigrationInterface {
  name = 'AddVarietyModel1699833298479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "varieties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "commodity_id" uuid NOT NULL, CONSTRAINT "VARIETY_NAME_COMMODITY" UNIQUE ("name", "commodity_id"), CONSTRAINT "PK_f229db9682abd731367f2dccaea" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `ALTER TABLE "varieties" ADD CONSTRAINT "FK_54cc7ee80d2c0fdc958fd4912b0" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "varieties" DROP CONSTRAINT "FK_54cc7ee80d2c0fdc958fd4912b0"`);
    await queryRunner.query(`DROP TABLE "varieties"`);
  }
}
