import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsObject, IsOptional, Max, Min, ValidateNested } from "class-validator";
import { Order } from "src/constants/enums";

export class PageOptionsDto<T> {
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.ASC;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly take?: number = 10;

    @IsObject()
    @IsOptional()
    @Transform(({ value }) => {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    })
    @ValidateNested()
    readonly filters: T;


    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
