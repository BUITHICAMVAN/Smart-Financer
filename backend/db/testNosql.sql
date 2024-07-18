-- Create Account Table
CREATE TABLE IF NOT EXISTS public.account (
    userId VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    providerAccountId VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    access_token VARCHAR(255),
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    PRIMARY KEY (provider, providerAccountId)
);

-- Create Session Table
CREATE TABLE IF NOT EXISTS public.session (
    sessionToken VARCHAR(255) NOT NULL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    expires DATE NOT NULL
);

-- Create VerificationToken Table
CREATE TABLE IF NOT EXISTS public.verificationToken (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires DATE NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Create User Table
CREATE TABLE IF NOT EXISTS public.user (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    emailVerified DATE DEFAULT NOW(),
    image VARCHAR(255),
    monthlyIncome NUMERIC,
    needsPercentage NUMERIC NOT NULL DEFAULT 50,
    wantsPercentage NUMERIC NOT NULL DEFAULT 30,
    investmentsPercentage NUMERIC NOT NULL DEFAULT 20,
    savingsBalance NUMERIC NOT NULL DEFAULT 0,
    totalInvested NUMERIC NOT NULL DEFAULT 0,
    investmentsBalance NUMERIC NOT NULL DEFAULT 0,
    miscellanousBalance NUMERIC NOT NULL DEFAULT 0,
    duePayable NUMERIC NOT NULL DEFAULT 0,
    dueReceivable NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(1) NOT NULL DEFAULT '₹'
);

-- Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    monthIncome NUMERIC NOT NULL,
    totalSpendings NUMERIC NOT NULL DEFAULT 0,
    createdAt DATE NOT NULL DEFAULT NOW(),
    needsPercentage NUMERIC NOT NULL,
    wantsPercentage NUMERIC NOT NULL,
    investmentsPercentage NUMERIC NOT NULL,
    FOREIGN KEY (userId) REFERENCES public.user(id)
);

-- Create Needs Table
CREATE TABLE IF NOT EXISTS public.needs (
    id SERIAL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    description VARCHAR(100) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    bookId INTEGER NOT NULL,
    dueType VARCHAR(100) NOT NULL CHECK (dueType IN ('payable')),
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id),
    FOREIGN KEY (bookId) REFERENCES public.books(id)
);

-- Create Wants Table
CREATE TABLE IF NOT EXISTS public.wants (
    id SERIAL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    description VARCHAR(100) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    bookId INTEGER NOT NULL,
    dueType VARCHAR(100) NOT NULL CHECK (dueType IN ('payable')),
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id),
    FOREIGN KEY (bookId) REFERENCES public.books(id)
);

-- Create Savings Table
CREATE TABLE IF NOT EXISTS public.savings (
    id SERIAL PRIMARY KEY,
    entryName VARCHAR(100) NOT NULL,
    entryType VARCHAR(100) NOT NULL CHECK (entryType IN ('in', 'out')),
    amount NUMERIC NOT NULL,
    dueType VARCHAR(100) CHECK (dueType IN ('payable', 'receivable')),
    transferingTo VARCHAR(100) CHECK (transferingTo IN ('investments', 'miscellaneous')),
    transferingFrom VARCHAR(100) CHECK (transferingFrom IN ('investments', 'miscellaneous')),
    userId VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id)
);

-- Create Investments Table
CREATE TABLE IF NOT EXISTS public.investments (
    id SERIAL PRIMARY KEY,
    entryName VARCHAR(100) NOT NULL,
    tradeBooks BOOLEAN NOT NULL DEFAULT FALSE,
    entryType VARCHAR(100) NOT NULL CHECK (entryType IN ('in', 'out')),
    amount NUMERIC NOT NULL,
    transferingTo VARCHAR(100) CHECK (transferingTo IN ('savings', 'miscellaneous')),
    transferingFrom VARCHAR(100) CHECK (transferingFrom IN ('savings', 'miscellaneous')),
    userId VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id)
);

-- Create Miscellaneous Table
CREATE TABLE IF NOT EXISTS public.miscellaneous (
    id SERIAL PRIMARY KEY,
    entryName VARCHAR(100) NOT NULL,
    entryType VARCHAR(100) NOT NULL CHECK (entryType IN ('in', 'out')),
    amount NUMERIC NOT NULL,
    transferingTo VARCHAR(100) CHECK (transferingTo IN ('investments', 'savings')),
    transferingFrom VARCHAR(100) CHECK (transferingFrom IN ('investments', 'savings')),
    dueType VARCHAR(100) CHECK (dueType IN ('payable', 'receivable')),
    userId VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id)
);

-- Create Dues Table
CREATE TABLE IF NOT EXISTS public.dues (
    id SERIAL PRIMARY KEY,
    entryName VARCHAR(100) NOT NULL,
    dueStatus VARCHAR(100) NOT NULL DEFAULT 'pending' CHECK (dueStatus IN ('pending', 'paid')),
    dueType VARCHAR(100) NOT NULL CHECK (dueType IN ('payable', 'receivable')),
    amount NUMERIC NOT NULL,
    userId VARCHAR(255) NOT NULL,
    dueDate DATE NOT NULL,
    transferAccountType VARCHAR(100) CHECK (transferAccountType IN ('want', 'need', 'savings', 'miscellaneous')),
    transferAccountId INTEGER,
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id)
);

-- Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id SERIAL PRIMARY KEY,
    description VARCHAR(1000) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES public.user(id)
);
