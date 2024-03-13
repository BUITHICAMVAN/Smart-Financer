-- NAMNING CONVENTION 

CREATE DATABASE smartfinancer; 

CREATE TABLE IF NOT EXISTS public.user( 
    user_id SERIAL PRIMARY KEY, 
    user_fullname VARCHAR(255) 
);

-- User Table 
ALTER TABLE public.user 
ADD COLUMN user_email VARCHAR(255) NOT NULL UNIQUE,
ADD COLUMN user_emailVerified TIMESTAMP(3) DEFAULT NOW(),
ADD COLUMN user_password_hash VARCHAR(255),
ADD COLUMN user_isVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN user_image VARCHAR(255),
ADD COLUMN user_currency TYPE CHAR(3) USING user_currency::CHAR(3),
ADD COLUMN user_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;


-- Account Table
CREATE TABLE IF NOT EXISTS public.account (
    account_id VARCHAR(255) PRIMARY KEY,
    account_user_id INTEGER NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_expiresAt TYPE TIMESTAMP WITH TIME ZONE USING 
    to_timestamp(account_expiresAt),
    account_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT account_account_user_id FOREIGN KEY (account_user_id) REFERENCES public.user(user_id)
);


-- Income Types
CREATE TABLE IF NOT EXISTS public.income_type (
    income_type_id SERIAL PRIMARY KEY,
    income_type_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO public.income_type (income_type_name) VALUES ('Bouygues Company'), ('Private Tutoring'), ('Mentoring Cybersoft');

-- Income Table
CREATE TABLE IF EXISTS public.income(
    income_id SERIAL PRIMARY KEY,
    income_user_id INTEGER NOT NULL,
    income_amount FLOAT NOT NULL,
    income_type_id INTEGER,
    CONSTRAINT income_income_type_id FOREIGN KEY (income_type_id) REFERENCES public.income_type (income_type_id),
    CONSTRAINT income_income_user_id FOREIGN KEY(income_user_id) REFERENCES public.user(user_id),
    income_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
)


-- Saving Types
CREATE TABLE IF NOT EXISTS public.saving_type (
    saving_type_id SERIAL PRIMARY KEY,
    saving_type_name VARCHAR(255) NOT NULL
);

INSERT INTO public.saving_type (saving_type_name) VALUES ('Emergency Fund'), ('Housing'), ('Education');

-- Saving Table
CREATE TABLE IF EXISTS public.saving(
    saving_id SERIAL PRIMARY KEY,
    saving_user_id INTEGER NOT NULL,
    saving_amount FLOAT NOT NULL,
    saving_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saving_type_id INTEGER,
    CONSTRAINT saving_saving_type_id FOREIGN KEY (saving_type_id) REFERENCES public.saving_type (saving_type_id);
    CONSTRAINT saving_saving_user_id FOREIGN KEY (saving_user_id) REFERENCES public.user(user_id)
)


-- Expense Types Table
CREATE TABLE IF NOT EXISTS public.expense_type(
    expense_type_id SERIAL PRIMARY KEY,
    expense_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Populate the Expense Types table with initial data
INSERT INTO public.expense_type (expense_type_name) VALUES ('non-essential'), ('essential');

-- Expense Table
CREATE TABLE IF EXISTS public.expense(
    expense_id SERIAL PRIMARY KEY,
    expense_user_id INTEGER NOT NULL,
    expense_type_id INTEGER,
    expense_amount FLOAT NOT NULL,
    expense_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expense_expense_user_id FOREIGN KEY(expense_user_id) REFERENCES public.user(user_id),
    CONSTRAINT expense_expense_type_id FOREIGN KEY (expense_type_id) REFERENCES public.expense_type(expense_type_id)
)


-- Investment Types
-- CREATE TABLE IF NOT EXISTS public.investment_type (
--     investment_type_id SERIAL PRIMARY KEY,
--     investment_type_name VARCHAR(100) NOT NULL UNIQUE
-- );

-- INSERT INTO public.investment_type (investment_type_name) VALUES ('Stocks'), ('Bonds'), ('Real Estate');

-- -- Investment Table
-- CREATE TABLE IF NOT EXISTS public.investment(
--     investment_id SERIAL PRIMARY KEY,
--     investment_user_id INTEGER NOT NULL,
--     investment_amount FLOAT NOT NULL,
--     investment_notes TEXT,
--     investment_type_id INTEGER,
--     investment_goal_amount FLOAT,
--     investment_goal_deadline TIMESTAMP WITH TIME ZONE,
--     investment_createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT investment_investment_type_id FOREIGN KEY (investment_type_id) REFERENCES public.investment_type(investment_type_id);
--     CONSTRAINT investment_user_id_fk FOREIGN KEY (investment_user_id) REFERENCES public.user(user_id)
-- );


-- Goal Table
CREATE TABLE IF NOT EXISTS public.goal (
    goal_id SERIAL PRIMARY KEY,
    goal_user_id INTEGER NOT NULL,
    goal_name VARCHAR(255) NOT NULL,
    goal_amount FLOAT NOT NULL,
    goal_saved_amount FLOAT NOT NULL DEFAULT 0,
    goal_deadline TIMESTAMP WITH TIME ZONE,
    CONSTRAINT goal_user_id FOREIGN KEY (goal_user_id) REFERENCES public.user(user_id)
);
