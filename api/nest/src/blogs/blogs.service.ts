import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogDto } from './dto/blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  // 全件表示
  async findAll(): Promise<Blog[]> {
    return await this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 検索
  async search(query: string): Promise<Blog[]> {
    // クエリパラメータを空欄で区切り、配列に格納
    const queryArray = query.split(' ');
    // blogのtitleを絞り込むクエリ(を表すオブジェクト)を配列にまとめる
    const titleConditions = queryArray.map((query) => ({
      title: {
        contains: query,
      },
    }));
    // blogのcontentを絞り込むクエリ(を表すオブジェクト)を配列にまとめる
    const contentConditions = queryArray.map((query) => ({
      content: {
        contains: query,
      },
    }));
    // 上記の絞り込みを1配列にまとめる。これをprismaの検索条件とする。
    const conditions = [...titleConditions, ...contentConditions];
    return await this.prisma.blog.findMany({
      where: {
        OR: conditions,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ID指定
  async findById(id: number): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: id,
      },
    });
    if (!blog) throw new NotFoundException(['投稿が見つかりません。']);
    return blog;
  }

  // 新規作成
  async create(dto: BlogDto): Promise<void> {
    await this.prisma.blog.create({
      data: dto,
    });
  }

  // 編集
  async update(id: number, dto: BlogDto): Promise<void> {
    const blog = await this.findById(id); // 存在チェック(無ければ404エラー)
    await this.prisma.blog.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  // 削除
  async delete(id: number): Promise<void> {
    const blog = await this.findById(id); // 存在チェック(無ければ404エラー)
    await this.prisma.blog.delete({
      where: {
        id: id,
      },
    });
  }
}
