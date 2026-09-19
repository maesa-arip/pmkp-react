<?php

namespace Tests;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Traits that rebuild the schema by dropping every table first.
     */
    private const DESTRUCTIVE_TRAITS = [
        RefreshDatabase::class,
        DatabaseMigrations::class,
    ];

    protected function setUp(): void
    {
        // Runs before parent::setUp(), because that is what boots the traits.
        $this->guardAgainstDestructiveDatabaseTraits();

        parent::setUp();
    }

    /**
     * The suite runs against the database configured in .env, so a trait that
     * calls migrate:fresh would drop the working data. Tests here use
     * DatabaseTransactions instead and roll back what they create.
     */
    private function guardAgainstDestructiveDatabaseTraits(): void
    {
        if (($_SERVER['ALLOW_DESTRUCTIVE_DATABASE_TESTS'] ?? null) === 'true') {
            return;
        }

        $used = array_intersect(self::DESTRUCTIVE_TRAITS, class_uses_recursive(static::class));

        if ($used === []) {
            return;
        }

        throw new RuntimeException(sprintf(
            '%s uses %s, which would drop every table in the working database '
            .'configured in .env. Use Illuminate\Foundation\Testing\DatabaseTransactions '
            .'instead. If a throwaway test database is configured, set '
            .'ALLOW_DESTRUCTIVE_DATABASE_TESTS=true in phpunit.xml.',
            static::class,
            class_basename(reset($used))
        ));
    }
}
