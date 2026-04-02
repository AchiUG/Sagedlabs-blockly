
/**
 * User Service - Business logic for user management
 */

import { UserRepository } from '../repositories/user.repository';
import {
  IUserService,
  UserDTO,
  CreateUserInput,
  UpdateUserInput,
} from './interfaces/user.service.interface';
import { PaginationParams, PaginatedResult } from '../core/types/common.types';
import { NotFoundError, ConflictError } from '../core/errors/app-error';
import bcrypt from 'bcryptjs';

export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.mapToDTO(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.mapToDTO(user) : null;
  }

  async getUserWithProfile(id: string): Promise<any> {
    return this.userRepository.findByIdWithProfile(id);
  }

  async getAllUsers(
    params: PaginationParams
  ): Promise<PaginatedResult<UserDTO>> {
    const result = await this.userRepository.findAll(params);
    return {
      ...result,
      items: result.items.map(this.mapToDTO),
    };
  }

  async createUser(data: CreateUserInput): Promise<UserDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.mapToDTO(user);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDTO> {
    const user = await this.userRepository.update(id, data);
    return this.mapToDTO(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateUserArchetype(
    userId: string,
    archetype: string,
    secondary?: string
  ): Promise<UserDTO> {
    const user = await this.userRepository.updateArchetype(userId, archetype, secondary);
    return this.mapToDTO(user);
  }

  async updateUserSubscription(
    userId: string,
    tier: string,
    status: string
  ): Promise<UserDTO> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const user = await this.userRepository.updateSubscription(
      userId,
      tier,
      status,
      startDate,
      endDate
    );

    return this.mapToDTO(user);
  }

  private mapToDTO(user: any): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      archetype: user.archetype,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt,
    };
  }
}
