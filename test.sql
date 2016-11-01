ALTER SEQUENCE "User_id_seq" RESTART WITH 3;
INSERT INTO "User" 
  ( "id", "name" ) VALUES
  ( 1   , 'Paul' )
 ,( 2   , 'Bob'  )
;

INSERT INTO "Knowledge"
  ( "problem", "solution" , "idAuthor", "dateCreated", "dateUpdated" ) VALUES
  ( 'prob 1' , 'sol 1'    , 1         , '20111005'   , '20121005'    )
 ,( 'prob 2' , 'sol 2'    , 2         , DEFAULT      , DEFAULT       )
 ,( 'prob 21', 'sol 21'   , 2         , DEFAULT      , DEFAULT       )
 ,( 'err  22', 'banfa 21' , 1         , '20131004'   , '20131004'    )
;