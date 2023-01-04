<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AddAdminToUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:admin {email} {--remove}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add or remove admin role from user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $email = $this->argument('email');
        $remove = $this->option('remove');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error('User not found');
            return Command::FAILURE;
        }

        if ($remove) {
            $user->removeRole('admin');
            $this->info('Admin role removed from user');
        } else {
            $user->assignRole('admin');
            $this->info('Admin role added to user');
        }

        return Command::SUCCESS;
    }
}
