DECLARE @UserId NVARCHAR(450);
DECLARE @RoleId NVARCHAR(450);

SELECT @UserId = Id FROM AspNetUsers WHERE UserName = 'sebastian';
SELECT @RoleId = Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN';

INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @UserId, @RoleId
WHERE NOT EXISTS (
    SELECT 1 
    FROM AspNetUserRoles 
    WHERE UserId = @UserId AND RoleId = @RoleId
);

DELETE FROM AspNetUserRoles 
WHERE UserId = (
    SELECT Id FROM AspNetUsers WHERE Id = @UserId
)
AND RoleId = (
    SELECT Id FROM AspNetRoles WHERE NormalizedName = 'USER'
);