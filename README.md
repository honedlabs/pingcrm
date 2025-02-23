# Ping CRM

This provides a demo application using the Honed package ecosystem, built on top 
of the [Inertia.js demo](https://demo.inertiajs.com/login) of the same name.

The Honed demo provides a full application with Inertia 2.0 features, modern
UI kits and Honed packages for DX.

## Installation
Clone the repository locally:
```bash
git clone 
```

Install composer (PHP) dependencies:

Install NPM dependencies:

Copy the environment file:

Generate an application key:

Create an SQLite database
```bash
touch database/database.sqlite
```

Or use your tooling of choice (eg: Docker) to create a Postgres or MySQL database.
Using Sail, which comes installed with Laravel:
```bash
php artisan sail:install
```

With the database created, run the migrations:
```bash
php artisan migrate:fresh --seed
```

And run the dev commands all in one:
```bash
composer dev
```

It should be available at [http://localhost](http://localhost), or another
host depending on your machine configuration.

Login with the following credentials, which come prepopulated in this demo.
```
Email: johndoe@example.com
Password: secret
```

## Testing
Run the tests:
```bash
composer test
```

Similarly, you can evaluate the code:
```bash
composer eval
```

## Production
The demo site is available at [https://demo.honed.dev](https://demo.honed.dev).
All data is wiped periodically.

## Documentation
You can find the full documentation, and more, on the [Honed main site](https://honed.dev).
