import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUnidadesDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
