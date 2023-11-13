import { UUID } from '~/apps/core/domain/uuid';

export interface Person {
  id: UUID;
  name: string;
  lastName: string;
  email: string;
}
