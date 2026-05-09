/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Проверяем и создаем ENUM типы (без IF NOT EXISTS)
  // Сначала проверяем существование типа через raw SQL
  await knex.raw(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;
    END
    $$;
  `);
  
  await knex.raw(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
            CREATE TYPE order_status AS ENUM ('новый', 'в обработке', 'отправлен', 'доставлен', 'отменен');
        END IF;
    END
    $$;
  `);
  
  await knex.raw(`
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
            CREATE TYPE request_status AS ENUM ('новая', 'в работе', 'выполнена', 'отменена');
        END IF;
    END
    $$;
  `);
  
  // 1. Таблица пользователей
  await knex.schema.createTable("users", function(table) {
    table.increments("id").primary();
    table.string("username", 100).notNullable();
    table.string("email", 255).unique().notNullable();
    table.string("phone", 20);
    table.string("password_hash", 255).notNullable();
    table.specificType("role", "user_role").defaultTo('user');
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  // 2. Таблица категорий
  await knex.schema.createTable("categories", function(table) {
    table.increments("id").primary();
    table.string("name", 100).unique().notNullable();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  // 3. Таблица товаров
  await knex.schema.createTable("products", function(table) {
    table.increments("id").primary();
    table.integer("category_id").references("id").inTable("categories").onDelete("SET NULL");
    table.string("name", 200).notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable();
    table.string("size", 20);
    table.string("color", 50);
    table.string("material", 100);
    table.integer("stock_quantity").defaultTo(0);
    table.string("image_url", 500);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  // 4. Таблица корзины
  await knex.schema.createTable("cart", function(table) {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "product_id"]);
  });
  
  // 5. Таблица избранного
  await knex.schema.createTable("favorites", function(table) {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "product_id"]);
  });
  
  // 6. Таблица заказов
  await knex.schema.createTable("orders", function(table) {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("order_date").defaultTo(knex.fn.now());
    table.specificType("status", "order_status").defaultTo('новый');
    table.decimal("total_amount", 10, 2).notNullable();
    table.text("delivery_address");
    table.string("phone", 20).notNullable();
    table.text("notes");
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  // 7. Таблица позиций заказа
  await knex.schema.createTable("order_items", function(table) {
    table.increments("id").primary();
    table.integer("order_id").notNullable().references("id").inTable("orders").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products").onDelete("RESTRICT");
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price_at_time", 10, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  // 8. Таблица заявок в ателье
  await knex.schema.createTable("atelier_requests", function(table) {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("request_date").defaultTo(knex.fn.now());
    table.string("service_type", 50).notNullable();
    table.text("description").notNullable();
    table.string("photo_url", 500);
    table.string("contact_phone", 20).notNullable();
    table.specificType("status", "request_status").defaultTo('новая');
    table.text("admin_notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Удаляем таблицы
  await knex.schema.dropTableIfExists("atelier_requests");
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("favorites");
  await knex.schema.dropTableIfExists("cart");
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("categories");
  await knex.schema.dropTableIfExists("users");
  
  // Удаляем ENUM типы
  await knex.raw(`DROP TYPE IF EXISTS user_role`);
  await knex.raw(`DROP TYPE IF EXISTS order_status`);
  await knex.raw(`DROP TYPE IF EXISTS request_status`);
};