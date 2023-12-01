export class User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
  mobileNumber: string;

  constructor(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    mobileNumber: string,
    repeatPassword: string,
  ) {
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.repeatPassword = repeatPassword;
    this.mobileNumber = mobileNumber;
  }
}
