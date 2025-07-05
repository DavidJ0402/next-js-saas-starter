/*
  # Add Stripe Customer ID to Users Table

  1. Changes
    - Add `stripe_customer_id` column to `users` table
    - This allows users to have their own Stripe customer ID for individual payments

  2. Notes
    - This is optional and only needed if you want individual user payments
    - Teams can still have their own Stripe customer ID for team subscriptions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE users ADD COLUMN stripe_customer_id text;
  END IF;
END $$;