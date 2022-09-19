To effect id autoincrement in PostGres after adding mock data, run:

```sql
SELECT setval(pg_get_serial_sequence('access', 'id'), coalesce(max(id)+1, 1), false) FROM access;
SELECT setval(pg_get_serial_sequence('project', 'id'), coalesce(max(id)+1, 1), false) FROM project;
```

