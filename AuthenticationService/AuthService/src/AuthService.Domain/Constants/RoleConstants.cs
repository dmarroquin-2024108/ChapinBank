using System;
using System.Security.Cryptography.X509Certificates;

namespace AuthService.Domain.Constants;

public class RoleConstants
{
    public const string USER_ROLE = "USER_ROLE";
    public const string ADMIN_ROLE = "ADMIN_ROLE";
    public const string SUPERADMIN_ROLE = "SUPERADMIN_ROLE";
    //arreglo estatico para no crear instancias
    public static readonly string[]AllowedRoles = [USER_ROLE, ADMIN_ROLE, SUPERADMIN_ROLE];
    
}
