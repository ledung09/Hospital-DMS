SELECT * FROM Imported_Medicine WHERE Provider_Number = 2343;

SELECT relname AS "relation",
    pg_relation_size (C.oid) / 8192 AS "blocks",
    pg_size_pretty ( pg_relation_size (C.oid)) AS "size"
FROM pg_class C
LEFT JOIN pg_namespace N ON (N.oid = C. relnamespace )
WHERE relname = 'Imported_Medicine' ;

EXPLAIN ANALYZE SELECT * FROM Imported_Medicine WHERE Provider_Number = 2343;

CREATE INDEX idx_provider_number ON Imported_Medicine ( Provider_Number );

SELECT * FROM Imported_Medicine WHERE Provider_Number = 2343;

EXPLAIN ANALYZE SELECT * FROM Imported_Medicine WHERE Provider_Number = 2343;