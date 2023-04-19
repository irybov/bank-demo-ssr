INSERT INTO bankdemo.accounts(id, is_active, birthday, name, password, phone, surname, created_at, updated_at)
VALUES('0', '1', '2001-01-01', 'Admin', crypt('superadmin', gen_salt('bf', 4)), '0000000000', 'Adminsky', now(), now());
INSERT INTO bankdemo.accounts(is_active, birthday, name, password, phone, surname, created_at, updated_at)
VALUES('1', '1981-09-26', 'Marica', crypt('supervixen', gen_salt('bf', 4)), '1111111111', 'Hase', now(), now()),
('1', '1983-12-02', 'Sarah', crypt('bustyblonde', gen_salt('bf', 4)), '2222222222', 'Vandella', now(), now()),
('1', '1995-01-25', 'Lily', crypt('gingerchick', gen_salt('bf', 4)), '3333333333', 'Cade', now(), now())
ON CONFLICT ON CONSTRAINT accounts_phone_key DO NOTHING;
INSERT INTO bankdemo.roles(account_id, roles) SELECT id, 'ADMIN' FROM bankdemo.accounts WHERE phone='0000000000'
UNION SELECT id, 'CLIENT' FROM bankdemo.accounts WHERE phone='1111111111'
UNION SELECT id, 'CLIENT' FROM bankdemo.accounts WHERE phone='2222222222'
UNION SELECT id, 'CLIENT' FROM bankdemo.accounts WHERE phone='3333333333'
UNION SELECT id, 'ADMIN' FROM bankdemo.accounts WHERE phone='3333333333';