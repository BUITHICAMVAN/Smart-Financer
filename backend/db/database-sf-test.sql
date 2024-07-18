-- Table: public.user

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id serial PRIMARY KEY,
    user_fullname VARCHAR(255),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_email_verified TIMESTAMP DEFAULT now(),
    user_password_hash VARCHAR(255),
    user_is_verified BOOLEAN DEFAULT false,
    user_image VARCHAR(255),
    user_currency_unit CHAR(3),
    user_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_default_language VARCHAR(20),
    user_need_ratio DOUBLE PRECISION DEFAULT 50.0,
    user_want_ratio DOUBLE PRECISION DEFAULT 20.0,
    user_saving_ratio DOUBLE PRECISION DEFAULT 30.0,
    user_expected_income DOUBLE PRECISION
);

-- Table: public.saving_type

CREATE TABLE IF NOT EXISTS public.saving_type
(
    saving_type_id serial PRIMARY KEY,
    saving_type_name VARCHAR(255) NOT NULL
);

-- Table: public.saving

CREATE TABLE IF NOT EXISTS public.saving
(
    saving_id serial PRIMARY KEY,
    saving_user_id INTEGER NOT NULL,
    saving_amount NUMERIC(15,2) NOT NULL,
    saving_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saving_type_id INTEGER,
    saving_note TEXT,
    CONSTRAINT fk_saving_user FOREIGN KEY(saving_user_id) REFERENCES public."user"(user_id),
    CONSTRAINT fk_saving_type FOREIGN KEY(saving_type_id) REFERENCES public.saving_type(saving_type_id)
);

-- Table: public.income_type

CREATE TABLE IF NOT EXISTS public.income_type
(
    income_type_id serial PRIMARY KEY,
    income_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table: public.income

CREATE TABLE IF NOT EXISTS public.income
(
    income_id serial PRIMARY KEY,
    income_user_id INTEGER NOT NULL,
    income_amount NUMERIC(15,2) NOT NULL,
    income_type_id INTEGER,
    income_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    income_note TEXT,
    CONSTRAINT fk_income_user FOREIGN KEY(income_user_id) REFERENCES public."user"(user_id),
    CONSTRAINT fk_income_type FOREIGN KEY(income_type_id) REFERENCES public.income_type(income_type_id)
);

-- Table: public.expense_category

CREATE TABLE IF NOT EXISTS public.expense_category
(
    expense_category_id serial PRIMARY KEY,
    expense_category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table: public.expense_type

CREATE TABLE IF NOT EXISTS public.expense_type
(
    expense_type_id serial PRIMARY KEY,
    expense_type_name VARCHAR(100) NOT NULL UNIQUE,
    expense_category_id INTEGER,
    CONSTRAINT fk_expense_category FOREIGN KEY(expense_category_id) REFERENCES public.expense_category(expense_category_id)
);

-- Table: public.expense

CREATE TABLE IF NOT EXISTS public.expense
(
    expense_id serial PRIMARY KEY,
    expense_user_id INTEGER NOT NULL,
    expense_type_id INTEGER,
    expense_amount NUMERIC(15,2) NOT NULL,
    expense_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expense_note TEXT,
    CONSTRAINT fk_expense_user FOREIGN KEY(expense_user_id) REFERENCES public."user"(user_id),
    CONSTRAINT fk_expense_type FOREIGN KEY(expense_type_id) REFERENCES public.expense_type(expense_type_id)
);

-- Table: public.due_type

CREATE TABLE IF NOT EXISTS public.due_type
(
    due_type_id serial PRIMARY KEY,
    due_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: public.due_status

CREATE TABLE IF NOT EXISTS public.due_status
(
    due_status_id serial PRIMARY KEY,
    due_status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: public.due

CREATE TABLE IF NOT EXISTS public.due
(
    due_id serial PRIMARY KEY,
    due_user_id INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_details TEXT,
    due_amount NUMERIC(15,2) NOT NULL,
    due_type_id INTEGER NOT NULL,
    due_status_id INTEGER NOT NULL,
    CONSTRAINT fk_due_user FOREIGN KEY(due_user_id) REFERENCES public."user"(user_id),
    CONSTRAINT fk_due_type FOREIGN KEY(due_type_id) REFERENCES public.due_type(due_type_id),
    CONSTRAINT fk_due_status FOREIGN KEY(due_status_id) REFERENCES public.due_status(due_status_id)
);

-- Table: public.account

CREATE TABLE IF NOT EXISTS public.account
(
    account_id VARCHAR(255) PRIMARY KEY,
    account_user_id INTEGER NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_expires_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    account_language VARCHAR(50),
    account_timezone VARCHAR(50),
    CONSTRAINT fk_account_user FOREIGN KEY(account_user_id) REFERENCES public."user"(user_id)
);

-- Indexes for performance improvement
CREATE INDEX idx_user_email ON public."user"(user_email);
CREATE INDEX idx_saving_user_id ON public.saving(saving_user_id);
CREATE INDEX idx_income_user_id ON public.income(income_user_id);
CREATE INDEX idx_expense_user_id ON public.expense(expense_user_id);
CREATE INDEX idx_due_user_id ON public.due(due_user_id);

-- Insert values into public.user
INSERT INTO public."user" (user_fullname, user_email, user_password_hash, user_is_verified, user_image, user_currency_unit, user_default_language, user_need_ratio, user_want_ratio, user_saving_ratio, user_expected_income)
VALUES 
('John Doe', 'john.doe@example.com', 'hashedpassword1', true, 'image1.jpg', 'USD', 'en', 50.0, 20.0, 30.0, 5000.00),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword2', true, 'image2.jpg', 'EUR', 'fr', 40.0, 30.0, 30.0, 6000.00),
('Alice Johnson', 'alice.johnson@example.com', 'hashedpassword3', false, 'image3.jpg', 'GBP', 'en', 60.0, 20.0, 20.0, 4500.00);

-- Insert values into public.saving_type
INSERT INTO public.saving_type (saving_type_name)
VALUES 
('Emergency Fund'),
('Retirement Savings'),
('Vacation Fund');

-- Insert values into public.saving
INSERT INTO public.saving (saving_user_id, saving_amount, saving_type_id, saving_note)
VALUES 
(1, 1000.00, 1, 'Saving for emergencies'),
(2, 2000.00, 2, 'Retirement savings'),
(3, 1500.00, 3, 'Vacation fund');

-- Insert values into public.income_type
INSERT INTO public.income_type (income_type_name)
VALUES 
('Salary'),
('Bonus'),
('Freelance');

-- Insert values into public.income
INSERT INTO public.income (income_user_id, income_amount, income_type_id, income_note)
VALUES 
(1, 3000.00, 1, 'Monthly salary'),
(2, 500.00, 2, 'Annual bonus'),
(3, 800.00, 3, 'Freelance project');

-- Insert values into public.expense_category
INSERT INTO public.expense_category (expense_category_name)
VALUES 
('Housing'),
('Transportation'),
('Food');

-- Insert values into public.expense_type
INSERT INTO public.expense_type (expense_type_name, expense_category_id)
VALUES 
('Rent', 1),
('Bus Fare', 2),
('Groceries', 3);

-- Insert values into public.expense
INSERT INTO public.expense (expense_user_id, expense_type_id, expense_amount, expense_note)
VALUES 
(1, 1, 1200.00, 'Monthly rent'),
(2, 2, 50.00, 'Weekly bus fare'),
(3, 3, 300.00, 'Monthly groceries');

-- Insert values into public.due_type
INSERT INTO public.due_type (due_type_name)
VALUES 
('Credit Card Payment'),
('Loan Repayment'),
('Utility Bill');

-- Insert values into public.due_status
INSERT INTO public.due_status (due_status_name)
VALUES 
('Pending'),
('Paid'),
('Overdue');

-- Insert values into public.due
INSERT INTO public.due (due_user_id, due_date, due_due_date, due_details, due_amount, due_type_id, due_status_id)
VALUES 
(1, '2024-07-01 12:00:00+00', '2024-07-15 12:00:00+00', 'Credit card payment due', 500.00, 1, 1),
(2, '2024-07-05 12:00:00+00', '2024-07-20 12:00:00+00', 'Loan repayment due', 1000.00, 2, 2),
(3, '2024-07-10 12:00:00+00', '2024-07-25 12:00:00+00', 'Utility bill payment due', 150.00, 3, 3);

-- Insert values into public.account
INSERT INTO public.account (account_id, account_user_id, account_type, account_expires_at, account_language, account_timezone)
VALUES 
('acc1', 1, 'Premium', '2025-07-01 12:00:00+00', 'en', 'UTC'),
('acc2', 2, 'Basic', '2024-12-01 12:00:00+00', 'fr', 'UTC+1'),
('acc3', 3, 'Premium', '2025-01-01 12:00:00+00', 'en', 'UTC');
