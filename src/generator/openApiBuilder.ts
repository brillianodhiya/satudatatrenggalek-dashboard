import { DatasetDoc } from '../types';

export function buildOpenApiSpec(docs: DatasetDoc[], gatewayUrl?: string) {
  const paths: Record<string, any> = {};
  const masterPathsSet = new Set<string>();

  for (const doc of docs) {
    const pathKey = `/api/v1/datasets/${doc.id}/data`;

    // Query parameters from GET DATA table
    const queryParams = doc.parameters.map((p) => ({
      name: p.name,
      in: 'query',
      description: p.description,
      required: p.required || false,
      schema: {
        type: 'string'
      }
    }));

    if (!queryParams.some((q) => q.name.toLowerCase() === 'tahun')) {
      queryParams.push({
        name: 'tahun',
        in: 'query',
        description: 'Tahun data (contoh: 2025, 2026)',
        required: false,
        schema: {
          type: 'string'
        }
      });
    }

    // Build response schema properties from DATA KOLOM table
    const responseProperties: Record<string, any> = {};
    if (doc.columns && doc.columns.length > 0) {
      for (const col of doc.columns) {
        let openApiType = 'string';
        if (col.type.toLowerCase().includes('angka') || col.type.toLowerCase().includes('numerik') || col.type.toLowerCase().includes('number')) {
          openApiType = 'number';
        } else if (col.type.toLowerCase().includes('integer') || col.type.toLowerCase().includes('int')) {
          openApiType = 'integer';
        }

        responseProperties[col.name] = {
          type: openApiType,
          description: col.description
        };
      }
    } else {
      // Default fallback properties
      responseProperties['tahun'] = { type: 'string', description: 'Tahun data' };
      responseProperties['nilai'] = { type: 'string', description: 'Nilai data' };
    }

    paths[pathKey] = {
      get: {
        tags: ['Datasets'],
        summary: doc.title,
        description: `Endpoint data JSON utama untuk dataset ID ${doc.id}. URL asli: https://satudata.trenggalekkab.go.id/json/${doc.id}`,
        parameters: queryParams,
        responses: {
          '200': {
            description: 'Berhasil mengambil data dataset',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    dataset_id: { type: 'integer', example: doc.id },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: responseProperties
                      }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Gagal mengambil data dari server Satu Data Trenggalek'
          }
        }
      }
    };

    // Process secondary/master endpoints found inside this dataset page
    if (doc.secondaryEndpoints && doc.secondaryEndpoints.length > 0) {
      for (const sec of doc.secondaryEndpoints) {
        const masterPathKey = `/api/v1/master/${sec.type}/${sec.name}`;

        if (!masterPathsSet.has(masterPathKey)) {
          masterPathsSet.add(masterPathKey);

          paths[masterPathKey] = {
            get: {
              tags: ['Master Data'],
              summary: `Master Data ${sec.type.toUpperCase()}: ${sec.name.toUpperCase()}`,
              description: `API sekunder/referensi (${sec.type}) yang terdeteksi dari dataset #${doc.id}. URL asli: https://satudata.trenggalekkab.go.id${sec.endpoint}`,
              responses: {
                '200': {
                  description: `Berhasil mengambil master data ${sec.name}`,
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          status: { type: 'string', example: 'success' },
                          kategori: { type: 'string', example: sec.name },
                          data: {
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          };
        }
      }
    }
  }

  // Ensure default master vertikal kecamatan path exists
  if (!masterPathsSet.has('/api/v1/master/vertikal/kecamatan')) {
    paths['/api/v1/master/vertikal/kecamatan'] = {
      get: {
        tags: ['Master Data'],
        summary: 'Data Vertikal Master: KECAMATAN',
        description: 'Mengambil referensi ID & Keterangan untuk data vertikal kecamatan',
        responses: {
          '200': {
            description: 'Berhasil mengambil master data kecamatan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    kategori: { type: 'string', example: 'kecamatan' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          kecamatan_id: { type: 'string', example: '9' },
                          kecamatan_nama: { type: 'string', example: 'Bendungan' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'Satu Data Trenggalek OpenAPI & Gateway',
      version: '1.0.0',
      description: 'Dokumentasi & Proxy API terpusat untuk portal Satu Data Kabupaten Trenggalek (satudata.trenggalekkab.go.id).'
    },
    servers: [
      {
        url: gatewayUrl || 'http://localhost:3000',
        description: gatewayUrl ? 'API Gateway (Production)' : 'Local Proxy Gateway Server'
      }
    ],
    paths
  };
}
