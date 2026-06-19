import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Client;
  private readonly INDEX = 'portal_documents';

  constructor(private config: ConfigService) {
    this.client = new Client({
      node: this.config.get('ELASTICSEARCH_URL') ?? 'http://localhost:9200',
    });
  }

  async onModuleInit() {
    await this.ensureIndex();
  }

  private async ensureIndex() {
    const exists = await this.client.indices.exists({ index: this.INDEX });
    if (!exists) {
      await this.client.indices.create({
        index: this.INDEX,
        mappings: {
          properties: {
            id: { type: 'integer' },
            titleRo: { type: 'text', analyzer: 'romanian' },
            titleRu: { type: 'text', analyzer: 'russian' },
            bodyRo: { type: 'text', analyzer: 'romanian' },
            type: { type: 'keyword' },
            number: { type: 'keyword' },
            emitent: { type: 'keyword' },
            status: { type: 'keyword' },
            dateIssued: { type: 'date' },
          },
        },
      });
    }
  }

  async search(params: any) {
    const { q, tip, status, an, page = 1, limit = 15 } = params;
    const must: any[] = [{ multi_match: { query: q, fields: ['titleRo^3', 'titleRu^2', 'bodyRo'] } }];
    const filter: any[] = [];

    if (tip) filter.push({ term: { type: tip } });
    if (status) filter.push({ term: { status } });
    if (an) filter.push({ range: { dateIssued: { gte: `${an}-01-01`, lt: `${Number(an)+1}-01-01` } } });

    const result = await this.client.search({
      index: this.INDEX,
      from: (page - 1) * limit,
      size: limit,
      query: { bool: { must, filter } },
      highlight: { fields: { titleRo: {}, bodyRo: { fragment_size: 200 } } },
    });

    return {
      data: result.hits.hits.map((h: any) => h._source),
      meta: { total: (result.hits.total as any)?.value ?? 0, page, limit },
    };
  }

  async suggest(q: string): Promise<string[]> {
    if (!q || q.length < 2) return [];
    const result = await this.client.search({
      index: this.INDEX,
      size: 10,
      query: { match_phrase_prefix: { titleRo: { query: q, max_expansions: 20 } } },
      _source: ['titleRo', 'number'],
    });
    return result.hits.hits.map((h: any) => h._source.titleRo);
  }

  async indexDocument(doc: any) {
    await this.client.index({ index: this.INDEX, id: String(doc.id), document: doc });
  }

  async deleteDocument(id: number) {
    await this.client.delete({ index: this.INDEX, id: String(id) }).catch(() => {});
  }
}
