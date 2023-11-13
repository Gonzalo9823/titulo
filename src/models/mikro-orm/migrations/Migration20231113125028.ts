import { Migration } from '@mikro-orm/migrations';

export class Migration20231113125028 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "varieties" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "commodity_id" uuid not null, constraint "varieties_pkey" primary key ("id"));'
    );

    this.addSql('alter table "varieties" add constraint "varieties_name_commodity_id_unique" unique ("name", "commodity_id");');

    this.addSql(
      'alter table "varieties" add constraint "varieties_commodity_id_foreign" foreign key ("commodity_id") references "commodities" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "varieties" drop constraint "varieties_commodity_id_foreign";');

    this.addSql('drop table if exists "varieties" cascade;');
  }
}
