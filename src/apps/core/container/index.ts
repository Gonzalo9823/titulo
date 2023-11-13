import { Container } from 'inversify';

import { applicationsContainer } from '~/apps/core/container/applications';
import { repositoriesContainer } from '~/apps/core/container/repositories';

const container = Container.merge(applicationsContainer, repositoriesContainer);

export { container };
