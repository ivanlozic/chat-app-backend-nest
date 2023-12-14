import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Omit<CreateUserDto, 'friends'> {
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly repeatPassword: string;
  readonly mobileNumber: string;
}
