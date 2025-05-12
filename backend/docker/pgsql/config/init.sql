-- public.brands определение

-- Drop table

-- DROP TABLE public.brands;




-- public.positions определение

-- Drop table

-- DROP TABLE public.positions;

CREATE TABLE public.positions (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT positions_name_key UNIQUE (name),
	CONSTRAINT positions_pkey PRIMARY KEY (id)
);

INSERT INTO positions (name) VALUES
  ('Разыгрывающий'),
  ('Атакующий защитник'),
  ('Лёгкий форвард'),
  ('Тяжёлый форвард'),
  ('Центровой');

-- public.shops определение

-- Drop table

-- DROP TABLE public.shops;

CREATE TABLE public.shops (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	url text NULL,
	logo_url text NULL,
	CONSTRAINT shops_pkey PRIMARY KEY (id)
);


-- public.users определение

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	is_admin bool DEFAULT false NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- public.categories определение

-- Drop table

-- DROP TABLE public.categories;

CREATE TABLE public.categories (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	slug varchar(100) NOT NULL,
	parent_id int4 NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (id),
	CONSTRAINT categories_slug_key UNIQUE (slug),
	CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);
INSERT INTO public.categories (name, slug) VALUES
('Кроссовки', 'sneakers'),
('Мячи', 'balls'),
('Одежда', 'clothing'),
('Аксессуары', 'accessories');

-- Подкатегории для Одежды
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Майки', 'tops', 3),
('Футболки', 'tshirts', 3),
('Шорты', 'shorts', 3),
('Носки', 'socks', 3);

-- Подкатегории для Аксессуаров
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Чехол телефон', 'phonecase', 4),
('Чехол очки', 'glasscase', 4),
('Брелок', 'keychains', 4);

CREATE TABLE public.brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INT NOT NULL REFERENCES public.categories(id),
  CONSTRAINT brands_unique_pair UNIQUE (name, category_id)
);
-- Кроссовки (category_id = 1)
INSERT INTO public.brands (name, category_id) VALUES
  ('Nike', 1),
  ('Adidas', 1),
  ('Jordan', 1),
  ('Under Armour', 1),
  ('Puma', 1),
  ('Anta', 1),
  ('Li-Ning', 1),
  ('Reebok', 1)
ON CONFLICT (name, category_id) DO NOTHING;

-- Мячи (category_id = 2)
INSERT INTO public.brands (name, category_id) VALUES
  ('Spalding', 2),
  ('Wilson', 2),
  ('Molten', 2),
  ('Mikasa', 2),
  ('Demix', 2)
ON CONFLICT (name, category_id) DO NOTHING;

-- Одежда (category_id = 3)
INSERT INTO public.brands (name, category_id) VALUES
  ('Nike', 3),
  ('Adidas', 3),
  ('Under Armour', 3),
  ('Joma', 3),
  ('Kappa', 3),
  ('Puma', 3)
ON CONFLICT (name, category_id) DO NOTHING;

-- Аксессуары (category_id = 4)
INSERT INTO public.brands (name, category_id) VALUES
  ('McDavid', 4),
  ('G-Form', 4),
  ('Nike', 4),
  ('Molten', 4),
  ('Spalding', 4)
ON CONFLICT (name, category_id) DO NOTHING;


-- public.pick_history определение

-- Drop table

-- DROP TABLE public.pick_history;

CREATE TABLE public.pick_history (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT pick_history_pkey PRIMARY KEY (id),
	CONSTRAINT pick_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.products определение

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	brand_id int4 NOT NULL,
	price numeric(10, 2) NOT NULL,
	category_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
	CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);


-- public.product_growth_ranges определение

-- Drop table

-- DROP TABLE public.product_growth_ranges;

CREATE TABLE public.product_growth_ranges (
	product_id int4 NOT NULL,
	min_cm int4 NOT NULL,
	max_cm int4 NOT NULL,
	CONSTRAINT product_growth_ranges_pkey PRIMARY KEY (product_id, min_cm, max_cm),
	CONSTRAINT product_growth_ranges_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);


-- public.product_images определение

-- Drop table

-- DROP TABLE public.product_images;

CREATE TABLE public.product_images (
	id serial4 NOT NULL,
	product_id int4 NOT NULL,
	url text NOT NULL,
	sort_order int4 DEFAULT 0 NOT NULL,
	CONSTRAINT product_images_pkey PRIMARY KEY (id),
	CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);


-- public.product_offers определение

-- Drop table

-- DROP TABLE public.product_offers;

CREATE TABLE public.product_offers (
	id serial4 NOT NULL,
	product_id int4 NOT NULL,
	shop_id int4 NOT NULL,
	price numeric(10, 2) NOT NULL,
	product_url text NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT product_offers_pkey PRIMARY KEY (id),
	CONSTRAINT product_offers_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT product_offers_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);


-- public.product_positions определение

-- Drop table

-- DROP TABLE public.product_positions;

CREATE TABLE public.product_positions (
	product_id int4 NOT NULL,
	position_id int4 NOT NULL,
	CONSTRAINT product_positions_pkey PRIMARY KEY (product_id, position_id),
	CONSTRAINT product_positions_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id),
	CONSTRAINT product_positions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);


-- public.product_weight_ranges определение

-- Drop table

-- DROP TABLE public.product_weight_ranges;

CREATE TABLE public.product_weight_ranges (
	product_id int4 NOT NULL,
	min_kg int4 NOT NULL,
	max_kg int4 NOT NULL,
	CONSTRAINT product_weight_ranges_pkey PRIMARY KEY (product_id, min_kg, max_kg),
	CONSTRAINT product_weight_ranges_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);


-- public.reviews определение

-- Drop table

-- DROP TABLE public.reviews;

CREATE TABLE public.reviews (
	id serial4 NOT NULL,
	user_id int4 NULL,
	product_id int4 NOT NULL,
	rating int4 NOT NULL,
	"comment" text NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	is_approved bool DEFAULT false NOT NULL,
	CONSTRAINT reviews_pkey PRIMARY KEY (id),
	CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
	CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);


-- public.search_history определение

-- Drop table

-- DROP TABLE public.search_history;

CREATE TABLE public.search_history (
	id serial4 NOT NULL,
	user_id int4 NULL,
	query varchar(255) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT search_history_pkey PRIMARY KEY (id),
	CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);


-- public.user_brand_preferences определение

-- Drop table

-- DROP TABLE public.user_brand_preferences;

-- CREATE TABLE public.user_brand_preferences (
-- 	user_id int4 NOT NULL,
-- 	brand_id int4 NOT NULL,
-- 	CONSTRAINT user_brand_preferences_pkey PRIMARY KEY (user_id, brand_id),
-- 	CONSTRAINT user_brand_preferences_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE,
-- 	CONSTRAINT user_brand_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
-- );


-- public.user_profiles определение

-- Drop table

-- DROP TABLE public.user_profiles;

CREATE TABLE public.user_profiles (
	user_id int4 NOT NULL,
	name varchar(100) NOT NULL,
	height_cm int4 NULL,
	weight_kg int4 NULL,
	position_id int4 NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
	CONSTRAINT user_profiles_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id),
	CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.view_history определение

-- Drop table

-- DROP TABLE public.view_history;

CREATE TABLE public.view_history (
	id serial4 NOT NULL,
	user_id int4 NULL,
	product_id int4 NOT NULL,
	viewed_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT view_history_pkey PRIMARY KEY (id),
	CONSTRAINT view_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT view_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);


-- public.favorites определение

-- Drop table

-- DROP TABLE public.favorites;

CREATE TABLE public.favorites (
	user_id int4 NOT NULL,
	product_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT favorites_pkey PRIMARY KEY (user_id, product_id),
	CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.pick_history_items определение

-- Drop table

-- DROP TABLE public.pick_history_items;

CREATE TABLE public.pick_history_items (
	pick_id int4 NOT NULL,
	product_id int4 NOT NULL,
	score numeric(5, 2) NOT NULL,
	CONSTRAINT pick_history_items_pkey PRIMARY KEY (pick_id, product_id),
	CONSTRAINT pick_history_items_pick_id_fkey FOREIGN KEY (pick_id) REFERENCES public.pick_history(id) ON DELETE CASCADE,
	CONSTRAINT pick_history_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);