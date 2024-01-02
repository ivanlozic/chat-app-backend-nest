import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Omit<CreateUserDto, 'friends'> {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobileNumber: string;
}
