import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BlogDto {
  @IsString({ message: 'タイトルは文字列で入力してください。' })
  @IsNotEmpty({ message: 'タイトルを入力してください。' })
  @MaxLength(50, { message: 'タイトルは50文字以内で入力してください。' })
  title: string;

  @IsString({ message: '内容は文字列で入力してください。' })
  @IsNotEmpty({ message: '内容を入力してください。' })
  content: string;
}
