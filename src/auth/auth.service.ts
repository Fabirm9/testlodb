import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { CreateUserDto , LoginUserDto} from './dto';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ){

  }

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, email, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        email: email.toLowerCase(),
        password: bcrypt.hashSync( password, 10)
      });
      await this.userRepository.save(user);
      
      delete user.password;

      return {...user, token: this.getJwtToken({id:user.id})};
      
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async login(loginUserDto: LoginUserDto){
    let user: User;
    const { email, password} = loginUserDto;
    try {
      
      user = await this.userRepository.findOne({where: {email}, select:{email:true, password:true, id:true}});
      // const query = this.userRepository.createQueryBuilder();
      // user = await query.where( 'email=:email and password =:password' , { email: loginUserDto.email, password: bcrypt.hashSync(loginUserDto.password,10) }).getOne();
      
      if(!user)
        throw new UnauthorizedException(`Credentials are not valid (email)`);

      if(!bcrypt.compareSync(password,user.password))
        throw new UnauthorizedException(`Credentials are not valid (password)`);

    return {...user, token: this.getJwtToken({id:user.id})};

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async checkAuthStatus(user:User){
    const {id} = user;

    return{
      ...user,
      token: this.getJwtToken({id:user.id})
    }
  }
  
  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error:any) : never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail) 
    
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
