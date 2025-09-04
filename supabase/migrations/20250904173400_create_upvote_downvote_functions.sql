CREATE OR REPLACE FUNCTION handle_problem_upvote(problem_id_arg uuid, user_id_arg uuid)
RETURNS void AS $$
DECLARE
  is_upvoted boolean;
  is_downvoted boolean;
BEGIN
  -- Check if the user has already upvoted
  SELECT EXISTS (
    SELECT 1 FROM problem_upvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg
  ) INTO is_upvoted;

  -- Check if the user has downvoted
  SELECT EXISTS (
    SELECT 1 FROM problem_downvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg
  ) INTO is_downvoted;

  IF is_upvoted THEN
    -- User has already upvoted, so remove the upvote
    DELETE FROM problem_upvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg;
  ELSE
    -- User has not upvoted, so add the upvote
    INSERT INTO problem_upvotes (problem_id, user_id) VALUES (problem_id_arg, user_id_arg);
    -- If the user had previously downvoted, remove the downvote
    IF is_downvoted THEN
      DELETE FROM problem_downvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_problem_downvote(problem_id_arg uuid, user_id_arg uuid)
RETURNS void AS $$
DECLARE
  is_upvoted boolean;
  is_downvoted boolean;
BEGIN
  -- Check if the user has already upvoted
  SELECT EXISTS (
    SELECT 1 FROM problem_upvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg
  ) INTO is_upvoted;

  -- Check if the user has downvoted
  SELECT EXISTS (
    SELECT 1 FROM problem_downvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg
  ) INTO is_downvoted;

  IF is_downvoted THEN
    -- User has already downvoted, so remove the downvote
    DELETE FROM problem_downvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg;
  ELSE
    -- User has not downvoted, so add the downvote
    INSERT INTO problem_downvotes (problem_id, user_id) VALUES (problem_id_arg, user_id_arg);
    -- If the user had previously upvoted, remove the upvote
    IF is_upvoted THEN
      DELETE FROM problem_upvotes WHERE problem_id = problem_id_arg AND user_id = user_id_arg;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;