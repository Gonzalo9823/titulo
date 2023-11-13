import { Migration } from '@mikro-orm/migrations';

export class Migration20231113124958 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "commodities" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, constraint "commodities_pkey" primary key ("id"));'
    );

    this.addSql('alter table "commodities" add constraint "commodities_name_unique" unique ("name");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "commodities" cascade;');
  }
}
