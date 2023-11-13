import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHarvestModel1699833358473 implements MigrationInterface {
  name = 'AddHarvestModel1699833358473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "harvests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "grower_id" uuid NOT NULL, "grower_farm_id" uuid NOT NULL, "client_id" uuid NOT NULL, "commodity_id" uuid NOT NULL, "variety_id" uuid NOT NULL, CONSTRAINT "PK_fb748ae28bc0000875b1949a0a6" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `ALTER TABLE "harvests" ADD CONSTRAINT "FK_3179a9c7701f1290698bebe5e28" FOREIGN KEY ("grower_id") REFERENCES "growers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE "harvests" ADD CONSTRAINT "FK_5f3a73b40e3e4d76d58556b079d" FOREIGN KEY ("grower_farm_id") REFERENCES "grower_farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE "harvests" ADD CONSTRAINT "FK_75896748a792acfdebc110b47fa" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE "harvests" ADD CONSTRAINT "FK_8129582d542fbe61d98596fd00f" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE "harvests" ADD CONSTRAINT "FK_c86cfb793a782c21b094a43f294" FOREIGN KEY ("variety_id") REFERENCES "varieties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_c86cfb793a782c21b094a43f294"`);
    await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_8129582d542fbe61d98596fd00f"`);
    await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_75896748a792acfdebc110b47fa"`);
    await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_5f3a73b40e3e4d76d58556b079d"`);
    await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_3179a9c7701f1290698bebe5e28"`);
    await queryRunner.query(`DROP TABLE "harvests"`);
  }
}
