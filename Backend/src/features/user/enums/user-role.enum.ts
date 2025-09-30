enum UserRoleEnum {
  USER = 0,
  CLEANING_SERVICE = 1,
  MANAGEMENT = 2,
}

export const getUserRoleEnumLabel = (userRoleEnum: UserRoleEnum) => {
  switch (userRoleEnum) {
    case UserRoleEnum.USER:
      return 'User';
    case UserRoleEnum.CLEANING_SERVICE:
      return 'Cleaning Service';
    case UserRoleEnum.MANAGEMENT:
      return 'Management';
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
