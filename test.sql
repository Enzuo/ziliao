ALTER SEQUENCE "User_id_seq" RESTART WITH 3;
INSERT INTO "User" 
  ( "id", "name" ) VALUES
  ( 1   , 'Paul' )
 ,( 2   , 'Bob'  )
;

INSERT INTO "Knowledge"
  ( "problem", "solution" ) VALUES
  ( 'prob 1' , 'sol 1'    )
 ,( 'prob 2' , 'sol 2'    )
;

INSERT INTO "User_Knowledge" 
  ( "idUser" , "idKnowledge" ) VALUES
  ( 1        , 1             )
 ,( 2        , 2             )
;

