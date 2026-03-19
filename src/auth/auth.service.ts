import {
  Get,
  Injectable,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, id: user.id, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
