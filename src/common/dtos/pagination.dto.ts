import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @ApiProperty({
        default:10,
        description: 'How many rows do you need?'
    })
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type( () => Number)
    limit?: number;
    
    @ApiProperty({
        default:0,
        description: 'How many items do you want to skip?'
    })
    @IsOptional()
    @Type( () => Number)
    offset?: number;
}