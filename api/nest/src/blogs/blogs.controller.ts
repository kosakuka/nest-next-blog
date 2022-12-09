import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Blog } from '@prisma/client';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // 全件表示 もしくは 検索(同エンドポイントで行える)
  @Get()
  async findAll(@Query('q') query: string): Promise<Blog[]> {
    if (query && query != '') {
      // ----------クエリパラメータが空でない場合 → 検索-----------
      return await this.blogsService.search(query);
    } else {
      // ----------クエリパラメータが空の場合 → 全件表示-----------
      return await this.blogsService.findAll();
    }
  }

  // ID指定
  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Blog> {
    return await this.blogsService.findById(id);
  }

  // 新規作成
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: BlogDto): Promise<void> {
    return await this.blogsService.create(dto);
  }

  // 編集
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BlogDto,
  ): Promise<void> {
    return await this.blogsService.update(id, dto);
  }

  // 削除
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.blogsService.delete(id);
  }
}
