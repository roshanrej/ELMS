
export interface UserModel{
  id : number, // system internal id which cant be recreated to preserve history and identity
  email : string,
  name: string, //user facing identity which is unique and enforce by the db
  deptId : number, // foreign key many to one
  passwordHash : string, // stored passwordHash to validate user 
  roleId : number // system enforces permissions and exposure to services for a user
}