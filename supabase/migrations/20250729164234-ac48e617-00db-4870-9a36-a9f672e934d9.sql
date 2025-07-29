-- Fix Security Issue 1: Move pg_net extension from public to net schema
-- First drop the extension from public schema
DROP EXTENSION IF EXISTS pg_net;

-- Create the net schema and install pg_net there
CREATE SCHEMA IF NOT EXISTS net;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA net;

-- Grant necessary permissions for the functions to use net.http_post
GRANT USAGE ON SCHEMA net TO postgres, service_role;