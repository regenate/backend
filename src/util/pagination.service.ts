import { Injectable } from '@nestjs/common';
import { cloneDeep, isEmpty } from 'lodash';
import { Document, FilterQuery, Model } from 'mongoose';

@Injectable()
export class PaginationService {
  async paginate<T extends Document>(
    model: Model<Document>,
    criteria: FilterQuery<Model<Document>>,
    page = 1,
    limit = 10,
    populate: any[] | Record<string, unknown> = [],
    sort = { createdAt: -1 },
    populateObj = null,
  ): Promise<PaginationResult<T>> {
    const pagination: { page: number; limit: number } = {
      page: Math.ceil(page),
      limit: Math.ceil(limit),
    };
    let result: T[] = [];
    let prevPage: number | boolean;
    let nextPage: number | boolean;

    const params: any = criteria || { isDeleted: { $ne: true } };
    const count: number = await model.countDocuments(params);
    const totalPage = Math.ceil(count / pagination.limit);
    if (
      pagination.page >= 1 &&
      pagination.limit >= 1 &&
      totalPage >= pagination.page
    ) {
      const skip = limit * (pagination.page - 1);
      const query = model
        .find(params)
        .skip(skip)
        .sort(sort)
        .limit(pagination.limit);
      if (
        populate &&
        typeof populate === 'object' &&
        !Array.isArray(populate)
      ) {
        query.populate(populate);
      }
      if (!isEmpty(populate) && Array.isArray(populate)) {
        populate.forEach((p) => {
          query.populate(p);
        });
      }
      if (populateObj) {
        query.populate(populateObj);
      }
      result = (await query) as T[];

      prevPage = pagination.page - 1 > 0 ? pagination.page - 1 : false;
      nextPage = pagination.page + 1 > totalPage ? false : pagination.page + 1;
    }

    return {
      data: result,
      metadata: {
        page: pagination.page,
        perPage: pagination.limit,
        total: count,
        pageCount: result.length,
        previousPage: prevPage || false,
        nextPage: nextPage || false,
      },
    };
  }

  async aggregatePaginate<T>(
    model: Model<Document>,
    criteria: any[],
    page = 1,
    limit = 10,
  ): Promise<AggregatePaginationResult<T>> {
    const pagination: { page: number; limit: number } = {
      page: Math.ceil(page),
      limit: Math.ceil(limit),
    };
    let result: T[] = [];
    let prevPage: number | boolean;
    let nextPage: number | boolean;

    const params: any = cloneDeep(criteria);
    let count = 0;
    const resTotal = await model.aggregate(params).count('total');
    if (resTotal.length > 0) {
      count = resTotal[0].total;
    }

    const totalPage = Math.ceil(count / pagination.limit);
    if (
      pagination.page >= 1 &&
      pagination.limit >= 1 &&
      totalPage >= pagination.page
    ) {
      const skip = limit * (pagination.page - 1);
      const query = model
        .aggregate(criteria)
        .skip(skip)
        .limit(pagination.limit);

      result = (await query) as T[];

      prevPage = pagination.page - 1 > 0 ? pagination.page - 1 : false;
      nextPage = pagination.page + 1 > totalPage ? false : pagination.page + 1;
    }

    return {
      data: result,
      metadata: {
        page: pagination.page,
        perPage: pagination.limit,
        total: count,
        pageCount: result.length,
        previousPage: prevPage || false,
        nextPage: nextPage || false,
      },
    };
  }
}

export interface PaginationMetaData {
  page: number;
  perPage: number;
  total: number;
  previousPage: number | boolean;
  nextPage: number | boolean;
  pageCount: number;
}

export interface PaginationResult<T extends Document> {
  data: T[];
  metadata: PaginationMetaData;
}

export interface AggregatePaginationResult<T> {
  data: T[];
  metadata: PaginationMetaData;
}

export interface PaginationFilter {
  perPage?: number;
  page?: number;
}
