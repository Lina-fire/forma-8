/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Таблица пользователей
    .createTable("users", function(table) {
      table.increments("id").primary();
      table.string("username", 100).notNullable();
      table.string("email", 255).unique().notNullable();
      table.string("phone", 20);
      table.string("password_hash", 255).notNullable();
      table.string("role", 20).defaultTo('user');
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    
    // Таблица категорий
    .createTable("categories", function(table) {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
      table.text("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    
    // Таблица товаров
    .createTable("products", function(table) {
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
    })
    
    // Таблица корзины
    .createTable("cart", function(table) {
      table.increments("id").primary();
      table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
      table.integer("quantity").notNullable().defaultTo(1);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.unique(["user_id", "product_id"]);
    })
    
    // Таблица избранного
    .createTable("favorites", function(table) {
      table.increments("id").primary();
      table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.unique(["user_id", "product_id"]);
    })
    
    // Таблица заказов
    .createTable("orders", function(table) {
      table.increments("id").primary();
      table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
      table.timestamp("order_date").defaultTo(knex.fn.now());
      table.string("status", 50).defaultTo('новый');
      table.decimal("total_amount", 10, 2).notNullable();
      table.text("delivery_address");
      table.string("phone", 20).notNullable();
      table.text("notes");
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    
    // Таблица позиций заказа
    .createTable("order_items", function(table) {
      table.increments("id").primary();
      table.integer("order_id").notNullable().references("id").inTable("orders").onDelete("CASCADE");
      table.integer("product_id").notNullable().references("id").inTable("products").onDelete("RESTRICT");
      table.integer("quantity").notNullable().defaultTo(1);
      table.decimal("price_at_time", 10, 2).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    
    // Таблица заявок в ателье
    .createTable("atelier_requests", function(table) {
      table.increments("id").primary();
      table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
      table.timestamp("request_date").defaultTo(knex.fn.now());
      table.string("service_type", 50).notNullable();
      table.text("description").notNullable();
      table.string("photo_url", 500);
      table.string("contact_phone", 20).notNullable();
      table.string("status", 50).defaultTo('новая');
      table.text("admin_notes");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("atelier_requests")
    .dropTableIfExists("order_items")
    .dropTableIfExists("orders")
    .dropTableIfExists("favorites")
    .dropTableIfExists("cart")
    .dropTableIfExists("products")
    .dropTableIfExists("categories")
    .dropTableIfExists("users");
};