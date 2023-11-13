# Titulo - Type Script Clean Architecture

En esta rama se encontrara una App de prueba construida en `TypeScript` y `yarn` usando `Clean Architecture`.

Hay 3 versiones de `ORM` usados en la app (todos con `PostgreSQL`):
  - TypeORM
  - MikroORM
  - PG

Cada uno se puede usar corriendo un comando diferente.
  - `start:dev:mikro`
  - `start:dev:pg`
  - `start:dev:typeorm`

## Scripts Disponibles

| Script                    | Descripción                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| build                     | Transpila el TS a JS para ser usado en producción.                                            |
| lint                      | Corre TSC y Eslint para asegurarse que no hay problemas de tipos ni errores del linter.       |
| mikro                     | Permite correr comandos de Mikro ORM en producción.                                           |
| mikro:dev                 | Permite correr comandos de Mikro ORM en development.                                          |
| start:dev:mikro           | Corre app en development usando Mikro Orm.                                                    |
| start:dev:pg              | Corre app en development usando PG.                                                           |
| mstart:dev:typeorm        | Corre app en development usando Mikro ORM.                                                    |
| typeorm                   | Permite correr comandos de Type ORM en producción.                                            |
| typeorm:dev               | RPermite correr comandos de Type ORM en development.                                          |
