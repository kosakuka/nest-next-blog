import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: UserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        login_id: dto.login_id,
      },
    });
    if (user) {
      // 受け取ったlogin_idのユーザーがすでに存在するならエラーにする。
      throw new ForbiddenException(['該当idのユーザーがすでに存在します。']);
    }

    const hash = await argon.hash(dto.password);
    await this.prisma.user.create({
      data: {
        login_id: dto.login_id,
        password: hash,
      },
    });
  }

  async signin(dto: UserDto) {
    const user = await this.prisma.user.findFirst({
      where: { login_id: dto.login_id },
    });
    if (!user) {
      // 受け取ったlogin_idのユーザーが存在しないならエラーにする。
      throw new NotFoundException(['そのユーザーは存在しません。']);
    }
    // パスワードが正しいかチェック
    const isPasswordCorrect = await argon.verify(user.password, dto.password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException(['パスワードが正しくありません。']);
    }

    // jwtにセットするpayload
    const payload = {
      login_id: dto.login_id,
    };
    // トークン発行
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
