import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { GetUser, RoleProtected , RawHeaders , Auth } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user:User){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user:User,
    @GetUser('email') userEmail:string,
    @RawHeaders() rawHaders:string[],
    @Headers() headers:IncomingHttpHeaders
  ){
    
    return {
      ok:true,
      message: 'private',
      user,
      userEmail,
      rawHaders,
      headers
    }
  }


  //@SetMetadata('roles', ['admin','super-user'])
  
  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.user )
  @UseGuards( AuthGuard() , UserRoleGuard)
  privateRoute2(
    @GetUser() user:User,
  ){

    return {
      ok:true,
      message: 'private2',
      user,
    }

  }


  @Get('private3')
  @Auth(ValidRoles.user)
  privateRoute3(
    @GetUser() user:User,
  ){

    return {
      ok:true,
      message: 'private3',
      user,
    }

  }


}
