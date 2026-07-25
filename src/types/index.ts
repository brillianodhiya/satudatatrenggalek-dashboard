export interface ApiParameter {
  name: string;
  description: string;
  type: string;
  required?: boolean;
}

export interface ApiColumn {
  name: string;
  description: string;
  type: string;
  length?: string;
}

export interface SecondaryEndpoint {
  type: string; // e.g. 'vertikal', 'horisontal', 'lookup'
  name: string; // e.g. 'kecamatan'
  endpoint: string; // e.g. '/json/vertikal/kecamatan'
  description?: string;
}

export interface MasterDimension {
  id: string;
  name: string;
  endpoint: string;
}

export interface DatasetDoc {
  id: number;
  title: string;
  description?: string;
  dataEndpoint: string;
  method: string;
  parameters: ApiParameter[];
  columns?: ApiColumn[];
  secondaryEndpoints?: SecondaryEndpoint[];
  masterDimensions: MasterDimension[];
  sampleDataUrl?: string;
}
