<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateAmountValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:amount-values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate ship data programatically from old amount_type + amount to new amounts value';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $abilities = \App\Models\Ability::whereNull('amounts')
            // ->take(1)
            ->get();

        foreach ($abilities as $ability) {
            $this->info('Migrating Ability: ' . $ability->id_ability);

            $data = [[
                "type" => $ability->amount_type,
                "value" => $ability->amount,
                "children" => [],
            ]];

            $ability->amounts = $data;
            $ability->save();

            $this->line('Migration finished', 'success');
        }
        return Command::SUCCESS;
    }
}
