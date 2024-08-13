export type DcsPriceRequestDto = { charge_point: string; power_type: string; power: number }[];

export type DcsPriceResponseDto = DcsPriceItem[];

export type DcsPriceItem = {
  id: string;
  power_type: string;
  currency: string;
  elements: DcsPriceElement[];
  last_updated: number;
  price_identifier: DcsPriceIdentifier;
};

export type DcsPriceElement = {
  price_components: DcsPriceComponent[];
  restrictions: DcsPriceRestrictions;
};

export type DcsPriceComponent = {
  type: 'ENERGY' | 'TIME' | 'FLAT' | string;
  price: number;
  step_size: number;
};

export type DcsPriceRestrictions = {
  min_duration?: number;
};

export type DcsPriceIdentifier = {
  charge_point: string;
  power_type: string;
  power: number;
};

export type ConnectorPriceRequestDto = {
  charge_point: string;
  power_type: string;
  power: number;
};
