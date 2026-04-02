
# Core Library

This directory contains the foundational components of the application architecture.

## Structure

### `/types`
Common type definitions used across the application:
- `ApiResponse<T>`: Standardized API response format
- `PaginatedResult<T>`: Pagination structure
- `Result<T, E>`: Error handling monad pattern

### `/errors`
Centralized error handling:
- `AppError`: Base error class with status codes
- Specific error types: `NotFoundError`, `ValidationError`, `UnauthorizedError`, etc.

### `/utils`
Utility functions and helpers:
- `ResponseBuilder`: Construct standardized API responses

### `/config`
Application configuration:
- `AppConfig`: Centralized configuration management
- Environment-based settings
- Feature flags

## Usage Examples

### Error Handling
```typescript
import { NotFoundError, BusinessRuleError } from '@/lib/core/errors/app-error';

throw new NotFoundError('Course');
throw new BusinessRuleError('Cannot enroll in unpublished course');
```

### Response Building
```typescript
import { ResponseBuilder } from '@/lib/core/utils/response-builder';

return ResponseBuilder.success(data);
return ResponseBuilder.paginated(items, total, page, limit);
return ResponseBuilder.error(error);
```

### Configuration
```typescript
import { config } from '@/lib/core/config/app-config';

const dbUrl = config.get('database').url;
const isProduction = config.isProduction();
```
