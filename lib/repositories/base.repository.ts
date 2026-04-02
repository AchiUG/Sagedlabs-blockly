
/**
 * Base Repository - Abstract repository pattern
 * Provides common CRUD operations and can be extended for specific entities
 */

import { PrismaClient } from '@prisma/client';
import { PaginationParams, PaginatedResult, FilterParams } from '../core/types/common.types';
import { NotFoundError, DatabaseError } from '../core/errors/app-error';

export interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(params?: PaginationParams & FilterParams): Promise<PaginatedResult<T>>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T, CreateDTO, UpdateDTO>
  implements IRepository<T, CreateDTO, UpdateDTO>
{
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) {}

  protected getModel(): any {
    return (this.prisma as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    try {
      const model = this.getModel();
      return await model.findUnique({ where: { id } });
    } catch (error) {
      throw new DatabaseError(`Failed to find ${this.modelName} by id`, error);
    }
  }

  async findAll(
    params?: PaginationParams & FilterParams
  ): Promise<PaginatedResult<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        filters,
      } = params || {};

      const skip = (page - 1) * limit;
      const model = this.getModel();

      const where = this.buildWhereClause(search, filters);

      const [items, total] = await Promise.all([
        model.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        model.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      throw new DatabaseError(`Failed to fetch ${this.modelName} list`, error);
    }
  }

  async create(data: CreateDTO): Promise<T> {
    try {
      const model = this.getModel();
      return await model.create({ data });
    } catch (error) {
      throw new DatabaseError(`Failed to create ${this.modelName}`, error);
    }
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    try {
      await this.ensureExists(id);
      const model = this.getModel();
      return await model.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to update ${this.modelName}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.ensureExists(id);
      const model = this.getModel();
      await model.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to delete ${this.modelName}`, error);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const model = this.getModel();
      const count = await model.count({ where: { id } });
      return count > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to check ${this.modelName} existence`, error);
    }
  }

  protected async ensureExists(id: string): Promise<void> {
    const exists = await this.exists(id);
    if (!exists) {
      throw new NotFoundError(this.modelName);
    }
  }

  protected buildWhereClause(
    search?: string,
    filters?: Record<string, any>
  ): any {
    const where: any = {};

    if (filters) {
      Object.assign(where, filters);
    }

    return where;
  }
}
