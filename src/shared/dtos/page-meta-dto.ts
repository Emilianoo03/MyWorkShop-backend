import { PageOptionsDto } from "./page-options-dto";

export interface PageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto<any>;
    itemCount: number;
    filters: Record<string, any>
}

export class PageMetaDto {

    readonly page: number;

    readonly take: number;

    readonly itemCount: number;

    readonly pageCount: number;

    readonly hasPreviousPage: boolean;

    readonly hasNextPage: boolean;

    readonly filters: (keyof PageOptionsDto<any>['filters'])[] | undefined;

    constructor({ pageOptionsDto, itemCount, filters }: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
        this.filters = filters ? Object.keys(filters) as (keyof PageOptionsDto<any>['filters'])[] : undefined;
    }
}