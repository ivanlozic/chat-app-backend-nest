export class CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobileNumber: string;

  constructor(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    mobileNumber: string,
  ) {
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;

    this.mobileNumber = mobileNumber;
  }
}
