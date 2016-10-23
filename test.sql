ALTER SEQUENCE "User_id_seq" RESTART WITH 3;
INSERT INTO "User" 
  ( "id", "name" ) VALUES
  ( 1   , 'Paul' )
 ,( 2   , 'Bob'  )
;

INSERT INTO "Knowledge"
  ( "problem", "solution" , "idAuthor") VALUES
  ( 'prob 1' , 'sol 1'    , 1         )
 ,( 'prob 2' , 'sol 2'    , 2         )
 ,( 'prob 21', 'sol 21'   , 2         )
;