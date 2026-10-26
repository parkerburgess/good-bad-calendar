-- Store UserId as NVARCHAR(50), matching sharpener's [sharpener].Exam.UserId.
--
-- getUserId() (wandering-parker-server) always returns a string: the JWT
-- `sub` in production (the auth service's serial User.UserId, e.g. "1"), or
-- "dev-user-1" when DISABLE_AUTH=true. An INT column can't hold the dev id.
--
-- The FKs to dbo.User are dropped because users belong to the auth service;
-- ownership is enforced by filtering on UserId in every query, as in
-- sharpener. Existing rows convert in place (1 -> '1'), so they still match
-- a real login.

SET XACT_ABORT ON;
BEGIN TRANSACTION;

ALTER TABLE goodbad.Category DROP CONSTRAINT FK_Category_User;
ALTER TABLE goodbad.Day      DROP CONSTRAINT FK_Day_User;

ALTER TABLE goodbad.Category DROP CONSTRAINT UQ_Categories_UserDisplay;

ALTER TABLE goodbad.Category ALTER COLUMN UserId NVARCHAR(50) NOT NULL;
ALTER TABLE goodbad.Day      ALTER COLUMN UserId NVARCHAR(50) NOT NULL;

ALTER TABLE goodbad.Category
  ADD CONSTRAINT UQ_Category_user_id_display_text UNIQUE (UserId, DisplayText);

CREATE INDEX IX_Day_UserId ON goodbad.Day (UserId);

-- Give the dev user (DISABLE_AUTH=true) the same categories as user 1.
INSERT INTO goodbad.Category (UserId, DisplayText, LegendText, SortOrder)
SELECT 'dev-user-1', C.DisplayText, C.LegendText, C.SortOrder
FROM goodbad.Category C
WHERE C.UserId = '1'
  AND NOT EXISTS (
    SELECT 1 FROM goodbad.Category CA
    WHERE CA.UserId = 'dev-user-1' AND CA.DisplayText = C.DisplayText
  );

COMMIT TRANSACTION;
