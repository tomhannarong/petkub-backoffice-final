
export const isAdmin = (user) => (!user
  ? false
  : user.roles.includes('ADMIN') || user.roles.includes('SUPERADMIN'));

export const isSuperAdmin = (user) => (!user ? false : user.roles.includes('SUPERADMIN'));

export const isClient = (user) => (!user
  ? false
  : !user.roles.includes('ADMIN')
      || !user.roles.includes('SUPERADMIN'));
