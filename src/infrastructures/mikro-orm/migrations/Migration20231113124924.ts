import { Migration } from '@mikro-orm/migrations';

export class Migration20231113124924 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "grower_farms" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "grower_id" uuid not null, "name" varchar(255) not null, "address" varchar(255) not null, constraint "grower_farms_pkey" primary key ("id"));'
    );

    this.addSql('alter table "grower_farms" add constraint "grower_farms_name_address_unique" unique ("name", "address");');

    this.addSql(
      'alter table "grower_farms" add constraint "grower_farms_grower_id_foreign" foreign key ("grower_id") references "growers" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "grower_farms" drop constraint "grower_farms_grower_id_foreign";');

    this.addSql('drop table if exists "grower_farms" cascade;');
  }
}
