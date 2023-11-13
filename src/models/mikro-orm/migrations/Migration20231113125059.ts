import { Migration } from '@mikro-orm/migrations';

export class Migration20231113125059 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "harvests" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "grower_id" uuid not null, "grower_farm_id" uuid not null, "client_id" uuid not null, "commodity_id" uuid not null, "variety_id" uuid not null, constraint "harvests_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "harvests" add constraint "harvests_grower_id_foreign" foreign key ("grower_id") references "growers" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "harvests" add constraint "harvests_grower_farm_id_foreign" foreign key ("grower_farm_id") references "grower_farms" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "harvests" add constraint "harvests_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "harvests" add constraint "harvests_commodity_id_foreign" foreign key ("commodity_id") references "commodities" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "harvests" add constraint "harvests_variety_id_foreign" foreign key ("variety_id") references "varieties" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "harvests" drop constraint "harvests_client_id_foreign";');

    this.addSql('alter table "harvests" drop constraint "harvests_commodity_id_foreign";');

    this.addSql('alter table "harvests" drop constraint "harvests_grower_id_foreign";');

    this.addSql('alter table "harvests" drop constraint "harvests_grower_farm_id_foreign";');

    this.addSql('alter table "harvests" drop constraint "harvests_variety_id_foreign";');

    this.addSql('drop table if exists "harvests" cascade;');
  }
}
