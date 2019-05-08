-- these command must be issued to reset the primary keys in sqllite tables


delete from jwtsecrets;    
delete from sqlite_sequence where name='jwtsecrets';

delete from  users;    
delete from sqlite_sequence where name='users';
