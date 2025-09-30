enum UserRoleEnum {
  ADMIN = 0,
  STUDENT = 1,
  LECTURER = 2,
}

export const getUserRoleEnumLabel = (userRoleEnum: UserRoleEnum) => {
  switch (userRoleEnum) {
    case UserRoleEnum.ADMIN:
      return 'Admin';
    case UserRoleEnum.STUDENT:
      return 'Student';
    case UserRoleEnum.LECTURER:
      return 'Lecturer';
    default:
      return 'Unknown';
  }
};

export const getUserRoleEnums = () => {
  const enums = Object.entries(UserRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getUserRoleEnumLabel(+value),
      });
    }
  }
  return result;
};

export default UserRoleEnum;
