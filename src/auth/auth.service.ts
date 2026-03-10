import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService
      .findAll()
      .then((users) => users.find((user) => user.email === signInDto.email));
    if (!user) {
      return { message: 'User not found' };
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      return { message: 'Invalid credentials' };
    }
    return { message: 'Sign in successful' };
  }
}
