export const ADMIN = {
  username: 'Admin',
  password: 'admin123',
};

export const INVALID_USER = {
  username: 'wronguser',
  password: 'wrongpass',
};

export const WRONG_PASSWORD = {
  username: 'Admin',
  password: 'wrongpass123',
};

// Employee test data

export const NEW_EMPLOYEE = {
  firstName:  'john',
  lastName:   'User${timestamp}',
  employeeId: 'EMP${Date.now()}',
};

export const EDITED_EMPLOYEE = {
  firstName:  'John23',
  lastName:   'Updated',
  employeeId: 'Jo8998',
};

export const NONEXISTENT_EMPLOYEE = {
  name: 'ZZZNobodyHasThisName',
  id:   'EMP9998',
};
