import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export interface RlsContext {
  tenantId: string;
  userId: string;
  userRole: string;
}

@Injectable()
export class RlsContextService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Creates a query runner with RLS context set
   * @param context - The RLS context containing tenant, user, and role information
   * @returns QueryRunner with RLS context configured
   */
  async createContextualQueryRunner(context: RlsContext): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Set RLS context variables
      await queryRunner.query(`SELECT set_config('app.tenant_id', $1, true)`, [
        context.tenantId,
      ]);
      await queryRunner.query(`SELECT set_config('app.user_id', $1, true)`, [
        context.userId,
      ]);
      await queryRunner.query(`SELECT set_config('app.user_role', $1, true)`, [
        context.userRole,
      ]);

      return queryRunner;
    } catch (error) {
      await queryRunner.release();
      throw error;
    }
  }

  /**
   * Executes a callback with RLS context set
   * @param context - The RLS context
   * @param callback - Function to execute with RLS context
   * @returns Result of the callback
   */
  async withRlsContext<T>(
    context: RlsContext,
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = await this.createContextualQueryRunner(context);

    try {
      return await callback(queryRunner);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Sets RLS context for the current connection
   * This should be used with caution as it affects the global connection
   * @param context - The RLS context
   */
  async setGlobalRlsContext(context: RlsContext): Promise<void> {
    await this.dataSource.query(
      `SELECT set_config('app.tenant_id', $1, true)`,
      [context.tenantId],
    );
    await this.dataSource.query(`SELECT set_config('app.user_id', $1, true)`, [
      context.userId,
    ]);
    await this.dataSource.query(
      `SELECT set_config('app.user_role', $1, true)`,
      [context.userRole],
    );
  }

  /**
   * Clears RLS context from the current connection
   */
  async clearGlobalRlsContext(): Promise<void> {
    await this.dataSource.query(`SELECT set_config('app.tenant_id', '', true)`);
    await this.dataSource.query(`SELECT set_config('app.user_id', '', true)`);
    await this.dataSource.query(`SELECT set_config('app.user_role', '', true)`);
  }

  /**
   * Gets the current RLS context from the database
   * @returns Current RLS context or null if not set
   */
  async getCurrentRlsContext(): Promise<RlsContext | null> {
    try {
      const [tenantResult, userResult, roleResult] = await Promise.all([
        this.dataSource.query(
          `SELECT current_setting('app.tenant_id', true) as value`,
        ),
        this.dataSource.query(
          `SELECT current_setting('app.user_id', true) as value`,
        ),
        this.dataSource.query(
          `SELECT current_setting('app.user_role', true) as value`,
        ),
      ]);

      const tenantId = tenantResult[0]?.value;
      const userId = userResult[0]?.value;
      const userRole = roleResult[0]?.value;

      if (tenantId && userId && userRole) {
        return { tenantId, userId, userRole };
      }

      return null;
    } catch (error) {
      console.warn('Error getting RLS context:', error.message);
      return null;
    }
  }
}
