import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsString({ message: 'ログインIDは文字列を入力してください。' })
  @IsNotEmpty({ message: 'ログインIDを入力してください。' })
  @MaxLength(20, { message: 'ログインIDは20文字以内で入力してください。' })
  login_id: string;

  @IsString({ message: 'パスワードは文字列を入力してください。' })
  @IsNotEmpty({ message: 'パスワードを入力してください。' })
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください。' })
  password: string;
}
