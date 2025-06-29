
-- Enable realtime for subscription-related tables
ALTER TABLE user_subscriptions REPLICA IDENTITY FULL;
ALTER TABLE user_word_credits REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE user_word_credits;
