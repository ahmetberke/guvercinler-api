import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { startWith } from "rxjs";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

export class GenericFilter {

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export const CreatePrismaQuery = <T>(filter : GenericFilter & T, fields : Array<string> = []) : any => {

  const query : Record<string, any> = {}
  const params = Object.keys(filter);
  
  const where : Record<string, any> = {}
  const includedParams = params.filter(p => fields.includes(p));
  if (includedParams.length > 0) {
    for (let p of includedParams) {
      where[p] = {
        startsWith: filter[p]
      }
    }
    query["where"] = where
  }

  if (filter.orderBy && [...fields, "createdAt"].includes(filter.orderBy)) {
    const orderBy : Record<string, any> = {}
    orderBy[filter.orderBy] = filter.sortOrder || "desc"
    query["orderBy"] = orderBy
  }else {
    const orderBy : Record<string, any> = {}
    orderBy["createdAt"] = "desc"
    query["orderBy"] = orderBy
  }

  let page = 1
  let pageSize = 10
  if (filter.page) page = parseInt(filter.page as unknown as string);
  if (filter.page <= 0) page = 1
  if (filter.pageSize) pageSize = parseInt(filter.pageSize as unknown as string);
  if (filter.pageSize <= 0) pageSize = 10

  query["skip"] = pageSize * (page-1)
  query["take"] = pageSize

  console.log(query)

  const meta = {
    page,
    pageSize,
  }

  return {
    query,
    meta
  }
  
}