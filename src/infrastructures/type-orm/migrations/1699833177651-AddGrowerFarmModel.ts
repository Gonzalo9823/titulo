import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGrowerFarmModel1699833177651 implements MigrationInterface {
  name = 'AddGrowerFarmModel1699833177651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "grower_farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "grower_id" uuid NOT NULL, CONSTRAINT "GROWER_FARM_NAME_ADDRESS" UNIQUE ("name", "address"), CONSTRAINT "PK_9bdcdfe20839501d61a28d9a187" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `ALTER TABLE "grower_farms" ADD CONSTRAINT "FK_2f51e669bb7a8d419c79eb9769b" FOREIGN KEY ("grower_id") REFERENCES "growers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "grower_farms" DROP CONSTRAINT "FK_2f51e669bb7a8d419c79eb9769b"`);
    await queryRunner.query(`DROP TABLE "grower_farms"`);
  }
}
