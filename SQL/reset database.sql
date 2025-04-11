DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql += 'DROP TABLE IF EXISTS [' + table_schema + '].[' + table_name + '];'
FROM information_schema.tables
WHERE table_type = 'BASE TABLE';

EXEC sp_executesql @sql;
