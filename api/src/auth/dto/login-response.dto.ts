import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cC1I6IkpXVCJ9.eyJc2VySWQiOiJ1c2VyLTEyMyIsInN1YiI6InVzZXItMTIzIiwiaWF0IjoxNjE2MjM5MDIyfQ.example',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User identifier',
    example: 'user-123',
  })
  userId: string;
}
