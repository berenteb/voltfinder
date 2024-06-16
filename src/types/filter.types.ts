export type PowerFilterItem = {
  type: 'power';
  value: number;
};

export type ProviderFilterItem = {
  type: 'provider';
  value: string[];
};

export type PlugFilterItem = {
  type: 'plug';
  value: string[];
};

export type FilterItem = PowerFilterItem | ProviderFilterItem | PlugFilterItem;
