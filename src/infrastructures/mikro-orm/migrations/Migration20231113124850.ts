import { Migration } from '@mikro-orm/migrations';

export class Migration20231113124850 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "growers" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, constraint "growers_pkey" primary key ("id"));'
    );

    this.addSql('alter table "growers" add constraint "growers_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "growers" cascade;');
  }
}
