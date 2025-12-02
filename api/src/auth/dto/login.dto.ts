import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'userId must be between 1 and 100 characters',
  })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'userId must contain only alphanumeric characters, hyphens, and underscores',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value as string;
  })
  userId: string;
}
