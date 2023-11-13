export const TYPES = {
  // Client
  CreateClient: Symbol.for('CreateClient'),
  GetClients: Symbol.for('GetClients'),
  GetClientById: Symbol.for('GetClientById'),
  ClientDBRepository: Symbol.for('ClientDBRepository'),

  // Commodity
  CreateCommodity: Symbol.for('CreateCommodity'),
  GetCommodities: Symbol.for('GetCommodities'),
  GetCommodityById: Symbol.for('GetCommodityById'),
  CommodityDBRepository: Symbol.for('CommodityDBRepository'),

  // Grower
  CreateGrower: Symbol.for('CreateGrower'),
  GetGrowers: Symbol.for('GetGrowers'),
  GetGrowerById: Symbol.for('GetGrowerById'),
  GrowerDBRepository: Symbol.for('GrowerDBRepository'),

  // Harvest
  CreateHarvest: Symbol.for('CreateHarvest'),
  GetHarvests: Symbol.for('GetHarvests'),
  GetHarvestById: Symbol.for('GetHarvestById'),
  HarvestDBRepository: Symbol.for('HarvestDBRepository'),
};
