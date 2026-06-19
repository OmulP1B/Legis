import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty() @IsString() titleRo: string;
  @ApiPropertyOptional() @IsOptional() @IsString() titleRu?: string;
  @ApiProperty() @IsString() bodyRo: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bodyRu?: string;
  @ApiProperty() @IsString() number: string;
  @ApiProperty() @IsInt() typeId: number;
  @ApiProperty() @IsInt() emitentId: number;
  @ApiProperty() @IsDateString() dateIssued: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() datePublished?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() parentId?: number;
}
