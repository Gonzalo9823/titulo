CREATE TABLE "growers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_e1ed51569a431fe2b9202d9fab0" UNIQUE ("email"), CONSTRAINT "PK_19a6664ebc3005c148734956658" PRIMARY KEY ("id"));
