import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class FilesService {
  private minioClient: Minio.Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get('MINIO_BUCKET') ?? 'portal-files';
    this.minioClient = new Minio.Client({
      endPoint: this.config.get('MINIO_ENDPOINT') ?? 'localhost',
      port: this.config.get<number>('MINIO_PORT') ?? 9000,
      useSSL: false,
      accessKey: this.config.get('MINIO_ACCESS_KEY') ?? 'minioadmin',
      secretKey: this.config.get('MINIO_SECRET_KEY') ?? 'minioadmin',
    });
  }

  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await this.minioClient.putObject(this.bucket, name, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    return name;
  }

  getUrl(objectName: string): string {
    const endpoint = this.config.get('MINIO_ENDPOINT') ?? 'localhost';
    const port = this.config.get('MINIO_PORT') ?? 9000;
    return `http://${endpoint}:${port}/${this.bucket}/${objectName}`;
  }
}
