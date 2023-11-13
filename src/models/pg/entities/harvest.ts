import { ClientModel } from '~/models/pg/entities/client';
import { CommodityModel } from '~/models/pg/entities/commodity';
import { CustomBaseModel } from '~/models/pg/entities/custom-base';
import { GrowerModel } from '~/models/pg/entities/grower';
import { GrowerFarmModel } from '~/models/pg/entities/grower-farm';
import { VarietyModel } from '~/models/pg/entities/variety';

export interface HarvestModel extends CustomBaseModel {
  grower: Omit<GrowerModel, 'farms'>;
  farm: Omit<GrowerFarmModel, 'grower'>;
  client: ClientModel;
  commodity: Omit<CommodityModel, 'varieties'>;
  variety: Omit<VarietyModel, 'commodity'>;
}
