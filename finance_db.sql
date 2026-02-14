-- Table: public.Category

-- DROP TABLE IF EXISTS public."Category";

CREATE TABLE IF NOT EXISTS public."Category"
(
    id integer NOT NULL DEFAULT nextval('"Category_id_seq"'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY (id),
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Category"
    OWNER to postgres;


    -- Table: public.transactions

-- DROP TABLE IF EXISTS public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id integer NOT NULL DEFAULT nextval('transactions_id_seq'::regclass),
    type enum_transactions_type NOT NULL,
    amount double precision NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    date timestamp with time zone,
    "categoryId" integer,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId")
        REFERENCES public."Category" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transactions
    OWNER to postgres;


    -- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(10) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;