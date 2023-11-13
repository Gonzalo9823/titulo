import { Migration } from '@mikro-orm/migrations';

export class Migration20231113124808 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "clients" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, constraint "clients_pkey" primary key ("id"));'
    );

    this.addSql('alter table "clients" add constraint "clients_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "clients" cascade;');
  }
}
